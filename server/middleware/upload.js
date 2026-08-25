const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Use memory storage — we stream the buffer directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files (jpg, png, webp) are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

/**
 * Upload a buffer to Cloudinary and return the secure URL and public_id.
 */
const uploadToCloudinary = (buffer, folder = 'namastenest') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary by its public_id.
 */
const deleteFromCloudinary = (public_id) => {
  return cloudinary.uploader.destroy(public_id);
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };
