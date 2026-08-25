const Property = require('./models/Property');

// Sample seed data for Namaste Nest
const seedData = [
  {
    name: 'Cozy Studio Suite',
    type: 'Studio',
    description: 'A warm and compact studio perfect for solo travelers or couples. Features a comfortable double bed, fully equipped kitchenette, and a private balcony overlooking Mysore\'s lush greenery. Ideal for short stays with all essentials covered.',
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
    description: 'Our most popular room type, the Standard Garden Room opens directly to our beautifully maintained garden. A spacious bedroom with a king-size bed, work desk, wardrobe, and an attached bathroom. Perfect for business travelers and couples looking for a peaceful retreat.',
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
    description: 'Step into a blend of traditional Mysore heritage decor and modern comfort. This spacious deluxe room features hand-crafted Mysore-style furniture, silk accents, and a large window overlooking the property. Comes with premium toiletries, a mini-fridge, and a sitting lounge area.',
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
    description: 'Our flagship offering — the Premium Suite is a luxurious haven spanning over 600 sq ft. Featuring a separate living room, king-size bedroom, and a modern bathroom with bathtub. Enjoy a private terrace with stunning views of the Chamundi Hills. Perfect for honeymooners, families, or anyone who deserves the best.',
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
    description: 'Designed with families in mind, this spacious room features one king-size bed and two single beds, making it perfect for families with children. Equipped with a large wardrobe, dining table, kitchenette, and a play area for kids. Enjoy a homely atmosphere right in the heart of Mysore.',
    shortDesc: 'Spacious family room with kitchenette & play area',
    price: 2799,
    images: [],
    capacity: 5,
    size: '550 sq ft',
    floor: 2,
    amenities: ['Free WiFi', 'AC', 'Hot Water', 'TV', 'Kitchenette', 'Dining Table', 'Wardrobe', 'Kid\'s Play Corner', 'Daily Housekeeping', 'Parking', 'Room Service'],
    highlights: ['Fits up to 5 guests', 'Kids friendly', 'Full kitchenette', 'Homely atmosphere'],
    isFeatured: false,
    isAvailable: true,
  },
];

module.exports = async (req, res) => {
  try {
    await Property.deleteMany();
    const inserted = await Property.insertMany(seedData);
    res.json({ success: true, message: `${inserted.length} properties seeded!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
