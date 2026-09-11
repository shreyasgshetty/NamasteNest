const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Use memory storage — we stream the buffer directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExt = /\.(jpeg|jpg|png|webp|avif|heic|heif)$/i;
  const isImageMime = file.mimetype && file.mimetype.startsWith('image/');
  const hasImageExt = file.originalname && allowedExt.test(file.originalname);

  if (isImageMime || hasImageExt) {
    cb(null, true);
  } else {
    cb(new Error(`File "${file.originalname}" is not a supported image format. Allowed formats: JPG, PNG, WebP, AVIF, HEIC.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
});

/**
 * Upload a buffer to Cloudinary and return the secure URL and public_id.
 */
const uploadToCloudinary = (buffer, folder = 'namastenest') => {
  return new Promise((resolve, reject) => {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return reject(
        new Error(
          'Cloudinary is not configured on the server. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables are set.'
        )
      );
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url) return reject(new Error('Cloudinary did not return a secure URL.'));
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    // Prevent unhandled stream error events from escaping
    stream.on('error', reject);
    stream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary by its public_id.
 */
const deleteFromCloudinary = (public_id) => {
  if (!public_id) return Promise.resolve();
  return cloudinary.uploader.destroy(public_id).catch(err => {
    console.warn(`Could not delete image ${public_id} from Cloudinary:`, err.message);
  });
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };
