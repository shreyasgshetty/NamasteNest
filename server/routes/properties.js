const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');
const { verifyAdmin } = require('../middleware/firebaseAdmin');

// Safe multer wrapper to intercept file filter / size limit errors before route execution
const handleUpload = (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'One or more images exceed the 10MB size limit.' });
      }
      return res.status(400).json({ success: false, message: err.message || 'Image upload failed.' });
    }
    next();
  });
};

// Helper to clean empty strings from numeric fields
const cleanDataFields = (data) => {
  if (data.location) {
    if (data.location.lat === '' || data.location.lat === null) delete data.location.lat;
    if (data.location.lng === '' || data.location.lng === null) delete data.location.lng;
  }
  if (data.reviews) {
    if (data.reviews.googleRating === '' || data.reviews.googleRating === null) delete data.reviews.googleRating;
    if (data.reviews.googleReviewCount === '' || data.reviews.googleReviewCount === null) delete data.reviews.googleReviewCount;
  }
  if (data.floor === '' || data.floor === null) delete data.floor;
  if (data.size === '' || data.size === null) delete data.size;
  return data;
};

// ─── PUBLIC ROUTES ────────────────────────────────────────────────
// GET all properties
router.get('/', async (req, res) => {
  try {
    const { type, featured } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (featured === 'true') filter.isFeatured = true;
    const props = await Property.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: props.length, data: props });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single property by slug
router.get('/:slug', async (req, res) => {
  try {
    const prop = await Property.findOne({ slug: req.params.slug });
    if (!prop) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: prop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── ADMIN ROUTES (protected) ─────────────────────────────────────
// POST create property (with images)
router.post('/', verifyAdmin, handleUpload, async (req, res) => {
  try {
    const rawData = JSON.parse(req.body.data || '{}');
    const data = cleanDataFields(rawData);

    // Upload each file buffer to Cloudinary
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadResults = await Promise.all(
        req.files.map(f => uploadToCloudinary(f.buffer))
      );
      images = uploadResults.map(r => JSON.stringify({ url: r.url, public_id: r.public_id }));
    }

    const prop = await Property.create({ ...data, images });
    res.status(201).json({ success: true, data: prop });
  } catch (err) {
    console.error('❌ Error creating property:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A property with this name or slug already exists. Please choose a unique name.',
      });
    }
    res.status(400).json({ success: false, message: err.message || 'Failed to create property' });
  }
});

// PUT update property (optionally add more images)
router.put('/:id', verifyAdmin, handleUpload, async (req, res) => {
  try {
    const rawData = JSON.parse(req.body.data || '{}');
    const data = cleanDataFields(rawData);

    const existing = await Property.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Property not found' });

    // Upload new files to Cloudinary
    let newImages = [];
    if (req.files && req.files.length > 0) {
      const uploadResults = await Promise.all(
        req.files.map(f => uploadToCloudinary(f.buffer))
      );
      newImages = uploadResults.map(r => JSON.stringify({ url: r.url, public_id: r.public_id }));
    }

    // Merge new images with existing ones (unless keepImages=false)
    const keepImages = data.keepImages !== false;
    const images = keepImages ? [...(existing.images || []), ...newImages] : newImages;
    delete data.keepImages;

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { ...data, images },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('❌ Error updating property:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A property with this name or slug already exists. Please choose a unique name.',
      });
    }
    res.status(400).json({ success: false, message: err.message || 'Failed to update property' });
  }
});

// DELETE single image from property (by encoded image object or public_id)
router.delete('/:id/images/:filename', verifyAdmin, async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Property not found' });

    const filename = decodeURIComponent(req.params.filename);

    // Find the image entry — could be a JSON string or a plain filename
    const imgEntry = prop.images.find(img => {
      try {
        const parsed = JSON.parse(img);
        return parsed.public_id === filename || parsed.url === filename || img === filename;
      } catch {
        return img === filename;
      }
    });

    if (imgEntry) {
      // Try to delete from Cloudinary
      try {
        const parsed = JSON.parse(imgEntry);
        if (parsed.public_id) await deleteFromCloudinary(parsed.public_id);
      } catch {
        // Legacy plain-filename entry — nothing to delete from Cloudinary
      }
      prop.images = prop.images.filter(img => img !== imgEntry);
    }

    await prop.save();
    res.json({ success: true, data: prop });
  } catch (err) {
    console.error('❌ Error deleting image:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE property entirely
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const prop = await Property.findByIdAndDelete(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Property not found' });

    // Delete all images from Cloudinary
    await Promise.allSettled(
      (prop.images || []).map(img => {
        try {
          const parsed = JSON.parse(img);
          if (parsed.public_id) return deleteFromCloudinary(parsed.public_id);
        } catch {
          // Legacy plain-filename — skip
        }
      })
    );

    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    console.error('❌ Error deleting property:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
