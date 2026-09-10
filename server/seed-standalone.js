// Standalone seed script — run from: d:\NamasteNest> node server/seed-standalone.js
// require paths are relative to THIS FILE's location (server/)
require('dotenv').config({ path: `${__dirname}/.env` });
const mongoose = require('mongoose');
const Property = require(`${__dirname}/models/Property`);

/**
 * Seed data for the NamasteNest platform.
 *
 * IMPORTANT:
 *   - Namaste Nest  → isFeatured: true   (the platform's primary featured stay)
 *   - All others    → isFeatured: false  (additional listings)
 *
 * Only Namaste Nest may display Airbnb reputation information (5.0 / 12+ reviews /
 * Guest favourite). Other listings do not inherit this data.
 *
 * Contact for all properties goes through the common /contact page.
 * There is NO per-property owner contact field.
 */
const seedData = [
  // ── FEATURED STAY ──────────────────────────────────────────────────────────
  {
    name: 'Namaste Nest',
    type: '4BHK',
    description: 'A spacious 4-bedroom luxury home stay in the heart of Gokulam, Mysuru. Fully furnished with modern amenities, a beautiful living space, and a warm hosting experience. Perfect for families, groups, and long-stay guests who want the comfort of home while exploring Mysuru.',
    shortDesc: 'Spacious 4 BHK luxury home stay in Gokulam, Mysuru.',
    price: 4000,
    images: [],
    capacity: 8,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ['Free WiFi', 'AC', 'Hot Water', 'Smart TV', 'Full Kitchen', 'Parking', 'Daily Housekeeping', 'Workspace'],
    highlights: ['Heart of Gokulam', '4 bedrooms & 4 bathrooms', 'Yoga community neighbourhood', 'Airbnb Guest favourite'],
    location: {
      address: '959, 7th Main, Gokulam 3rd Stage',
      city: 'Mysore',
      state: 'Karnataka',
      pincode: '570002',
    },
    reviews: {
      airbnbUrl: 'https://www.airbnb.com.sg/rooms/1669361340542473773',
    },
    isFeatured: true,   // ← THE PLATFORM'S FEATURED STAY. Do not change.
    isAvailable: true,
  },
  // ── OTHER STAYS (examples — replace with actual listings) ──────────────────
  {
    name: 'Cozy Studio Suite',
    type: 'Studio',
    description: 'A warm and compact studio perfect for solo travelers or couples. Features a comfortable double bed, fully equipped kitchenette, and a private balcony overlooking Mysore\'s lush greenery.',
    shortDesc: 'Compact & cozy studio with balcony views.',
    price: 999,
    images: [],
    capacity: 2,
    size: '250 sq ft',
    floor: 1,
    amenities: ['Free WiFi', 'AC', 'Hot Water', 'TV', 'Kitchenette', 'Balcony', 'Daily Housekeeping', 'Parking'],
    highlights: ['City view balcony', 'Ground floor access', 'Pet friendly'],
    isFeatured: false,
    isAvailable: true,
  },
  {
    name: 'Garden Villa',
    type: '2BHK',
    description: 'A bright and airy 2-bedroom villa with direct access to a private garden. Ideal for couples or small families looking for a relaxed Mysuru stay with a homely touch.',
    shortDesc: 'Airy 2 BHK villa with private garden access.',
    price: 2500,
    images: [],
    capacity: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Free WiFi', 'AC', 'Hot Water', 'TV', 'Garden Access', 'Parking', 'Daily Housekeeping'],
    highlights: ['Private garden', 'Quiet neighbourhood', 'Ideal for families'],
    isFeatured: false,
    isAvailable: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Drop the entire collection (clears documents + indexes) to start fresh
    const collections = await mongoose.connection.db.listCollections({ name: 'properties' }).toArray();
    if (collections.length > 0) {
      await mongoose.connection.db.dropCollection('properties');
      console.log('🗑️  Dropped existing properties collection');
    }

    // Use create() one-by-one so the pre-save slug hook fires
    const inserted = [];
    for (const item of seedData) {
      const doc = await Property.create(item);
      inserted.push(doc);
    }
    console.log(`🌱 Seeded ${inserted.length} properties successfully!`);
    console.log(
      '   ↳ ' +
        inserted
          .map(p => `${p.name} → slug: "${p.slug}" | isFeatured: ${p.isFeatured}`)
          .join('\n   ↳ ')
    );
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
