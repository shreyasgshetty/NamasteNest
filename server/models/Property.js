const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    type: {
      type: String,
      enum: ['Studio', '1BHK', '2BHK', '3BHK', '4BHK'],
      default: 'Studio',
    },
    description: { type: String, required: true },
    shortDesc: { type: String },
    price: { type: Number, required: true },

    // Images stored as filenames (served from /uploads/)
    images: [{ type: String }],

    // Per-property details
    capacity: { type: Number, default: 2 },
    size: { type: String },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    floor: { type: Number },

    // Per-property amenities (selected by admin)
    amenities: [{ type: String }],
    highlights: [{ type: String }],

    // Location — per property
    location: {
      address: { type: String },
      landmark: { type: String },
      city: { type: String, default: 'Mysore' },
      state: { type: String, default: 'Karnataka' },
      pincode: { type: String },
      lat: { type: Number },
      lng: { type: Number },
      googleMapsUrl: { type: String },  // embed URL for iframe
      googleMapsLink: { type: String }, // direct link for "Open in Maps"
    },

    // External review links
    reviews: {
      googleBusinessUrl: { type: String },
      airbnbUrl: { type: String },
      googleRating: { type: Number },
      googleReviewCount: { type: Number },
    },

    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate slug from name (async style for Mongoose 9)
propertySchema.pre('save', async function () {
  if (this.isModified('name') && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
});

module.exports = mongoose.model('Property', propertySchema);
