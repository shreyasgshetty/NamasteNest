const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');
const { verifyAdmin } = require('../middleware/firebaseAdmin');

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
router.post('/', verifyAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');

    // Upload each file buffer to Cloudinary
    const uploadResults = await Promise.all(
      (req.files || []).map(f => uploadToCloudinary(f.buffer))
    );

    // Store objects with url + public_id so we can delete later
    const images = uploadResults.map(r => JSON.stringify({ url: r.url, public_id: r.public_id }));

    const prop = await Property.create({ ...data, images });
    res.status(201).json({ success: true, data: prop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update property (optionally add more images)
router.put('/:id', verifyAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const existing = await Property.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });

    // Upload new files to Cloudinary
    const uploadResults = await Promise.all(
      (req.files || []).map(f => uploadToCloudinary(f.buffer))
    );
    const newImages = uploadResults.map(r => JSON.stringify({ url: r.url, public_id: r.public_id }));

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
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE single image from property (by encoded image object or public_id)
router.delete('/:id/images/:filename', verifyAdmin, async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Not found' });

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
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE property entirely
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const prop = await Property.findByIdAndDelete(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Not found' });

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
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
