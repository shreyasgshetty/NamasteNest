// Standalone seed script — run from: d:\NamasteNest> node server/seed-standalone.js
// require paths are relative to THIS FILE's location (server/)
require('dotenv').config({ path: `${__dirname}/.env` });
const mongoose = require('mongoose');
const Property = require(`${__dirname}/models/Property`);

const seedData = [
  {
    name: 'Cozy Studio Suite',
    type: 'Studio',
    description: 'A warm and compact studio perfect for solo travelers or couples. Features a comfortable double bed, fully equipped kitchenette, and a private balcony overlooking Mysore\'s lush greenery.',
    shortDesc: 'Compact & cozy studio with balcony views',
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
    name: 'Standard Garden Room',
    type: 'Standard',
    description: 'Our most popular room type. A spacious bedroom with king-size bed, work desk, wardrobe, and an attached bathroom, opening directly to our beautifully maintained garden.',
    shortDesc: 'Spacious room with private garden access',
    price: 1499,
    images: [],
    capacity: 2,
    size: '350 sq ft',
    floor: 1,
    amenities: ['Free WiFi', 'AC', 'Hot Water', 'TV', 'Work Desk', 'Wardrobe', 'Garden Access', 'Daily Housekeeping', 'Parking', 'Room Service'],
    highlights: ['Direct garden access', 'King-size bed', 'Work-friendly setup'],
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Deluxe Heritage Room',
    type: 'Deluxe',
    description: 'A blend of traditional Mysore heritage decor and modern comfort. Features hand-crafted Mysore-style furniture, silk accents, large panoramic windows, mini-fridge, coffee maker and a sitting lounge.',
    shortDesc: 'Heritage-themed deluxe room with lounge area',
    price: 2199,
    images: [],
    capacity: 3,
    size: '450 sq ft',
    floor: 2,
    amenities: ['Free WiFi', 'AC', 'Hot Water', 'Smart TV', 'Mini Fridge', 'Coffee Maker', 'Sitting Lounge', 'Premium Toiletries', 'Daily Housekeeping', 'Parking', 'Room Service', '24/7 Reception'],
    highlights: ['Mysore heritage decor', 'Mini fridge & coffee maker', 'Panoramic views'],
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Premium Suite',
    type: 'Suite',
    description: 'Our flagship suite — 600 sq ft of luxury with a separate living room, king-size bedroom, and a modern bathroom with bathtub. Enjoy a private terrace with stunning views of the Chamundi Hills.',
    shortDesc: 'Luxury suite with Chamundi Hills terrace views',
    price: 3499,
    images: [],
    capacity: 4,
    size: '600 sq ft',
    floor: 3,
    amenities: ['Free WiFi', 'AC', 'Hot Water', 'Smart TV', 'Mini Bar', 'Coffee Maker', 'Bathtub', 'Private Terrace', 'Living Room', 'Premium Toiletries', 'Daily Housekeeping', 'Parking', 'Room Service', '24/7 Reception', 'Laundry'],
    highlights: ['Chamundi Hills view', 'Private terrace', 'Bathtub & premium amenities', 'Separate living area'],
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Family Comfort Room',
    type: 'Family Room',
    description: 'Designed for families — one king-size bed and two single beds, a large wardrobe, dining table, kitchenette, and a play area for kids. A homely atmosphere right in the heart of Mysore.',
    shortDesc: 'Spacious family room with kitchenette & play area',
    price: 2799,
    images: [],
    capacity: 5,
    size: '550 sq ft',
    floor: 2,
    amenities: ['Free WiFi', 'AC', 'Hot Water', 'TV', 'Kitchenette', 'Dining Table', 'Wardrobe', "Kid's Play Corner", 'Daily Housekeeping', 'Parking', 'Room Service'],
    highlights: ['Fits up to 5 guests', 'Kids friendly', 'Full kitchenette', 'Homely atmosphere'],
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
    console.log('   ↳ ' + inserted.map(p => `${p.name} → slug: "${p.slug}"`).join('\n   ↳ '));
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
