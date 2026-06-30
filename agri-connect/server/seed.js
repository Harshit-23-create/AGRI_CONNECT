require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Article = require('./models/Article');
const connectDB = require('./config/db');

const seedProducts = [
  {
    title: 'Premium Basmati Rice', category: 'Grains', price: '₹4,200/qtl', quantity: '500 qtl available', rating: 4.8,
    seller: { name: 'Ramesh Farms', location: 'Punjab', phone: '+91-9876543210', email: 'ramesh@farms.com' }
  },
  {
    title: 'Fresh Potatoes', category: 'Vegetables', price: '₹1,800/qtl', quantity: '200 qtl available', rating: 4.6,
    seller: { name: 'Singh Agro', location: 'UP', phone: '+91-9876543211', email: 'singh@agro.com' }
  },
  {
    title: 'Hybrid Maize Seeds', category: 'Seeds', price: '₹980/kg', quantity: '50 kg available', rating: 4.9,
    seller: { name: 'AgriSeeds Co.', location: 'Haryana', phone: '+91-9876543212', email: 'sales@agriseeds.com' }
  },
  {
    title: 'Organic Urea Fertilizer', category: 'Fertilizers', price: '₹450/bag', quantity: '100 bags', rating: 4.5,
    seller: { name: 'Kisan Organics', location: 'Maharashtra', phone: '+91-9876543213', email: 'contact@kisanorg.com' }
  },
  {
    title: 'Neem Oil Pesticide', category: 'Pesticides', price: '₹300/liter', quantity: '50 liters', rating: 4.7,
    seller: { name: 'EcoPest Solutions', location: 'Gujarat', phone: '+91-9876543214', email: 'info@ecopest.com' }
  },
  {
    title: 'Heavy Duty Tractor', category: 'Equipment', price: '₹8,50,000', quantity: '2 available', rating: 4.9,
    seller: { name: 'FarmTech Motors', location: 'Punjab', phone: '+91-9876543215', email: 'sales@farmtech.com' }
  }
];

const seedArticles = [
  {
    title: 'Understanding Soil pH and Its Impact on Crops',
    category: 'Soil Management',
    readTime: '5-8 min read',
    content: 'Soil pH is a measure of the acidity or alkalinity of the soil. It is defined as the negative logarithm (base 10) of the activity of hydrogen ions (H+ or, more precisely, hydronium ions H3O+aq) in a solution. In soils, it is measured in a slurry of soil mixed with water (or a salt solution, such as 0.01 M CaCl2), and normally falls between 3 and 10, with 7 being neutral. Acid soils have a pH below 7 and alkaline soils have a pH above 7. Ultra-acidic soils (pH < 3.5) and very strongly alkaline soils (pH > 9) are rare. Soil pH is considered a master variable in soils as it affects many chemical processes.'
  },
  {
    title: 'How to Improve Soil Fertility Naturally',
    category: 'Soil Management',
    readTime: '6-10 min read',
    content: 'Improving soil fertility naturally involves practices like crop rotation, using cover crops, adding compost and organic manure, reducing tillage, and avoiding synthetic fertilizers. These practices build soil organic matter, improve soil structure, and encourage a healthy microbiome.'
  },
  {
    title: 'Integrated Pest Management (IPM) Basics',
    category: 'Pest & Disease Control',
    readTime: '4-7 min read',
    content: 'IPM is an effective and environmentally sensitive approach to pest management that relies on a combination of common-sense practices. IPM programs use current, comprehensive information on the life cycles of pests and their interaction with the environment. This information, in combination with available pest control methods, is used to manage pest damage by the most economical means, and with the least possible hazard to people, property, and the environment.'
  },
  {
    title: 'Drip Irrigation: Maximizing Water Efficiency',
    category: 'Water Management',
    readTime: '5-9 min read',
    content: 'Drip irrigation is a type of micro-irrigation system that has the potential to save water and nutrients by allowing water to drip slowly to the roots of plants, either from above the soil surface or buried below the surface. The goal is to place water directly into the root zone and minimize evaporation.'
  },
  {
    title: 'Drone Technology in Modern Farming',
    category: 'Modern Farming',
    readTime: '7-12 min read',
    content: 'Agricultural drones allow farmers to monitor crop health, estimate yields, and apply fertilizers and pesticides precisely. They provide high-resolution imaging and data analytics, enabling precision agriculture and significantly increasing farm efficiency and profitability.'
  },
  {
    title: 'Adopting Climate-Resilient Crops',
    category: 'Climate-Smart Farming',
    readTime: '6-9 min read',
    content: 'Climate-resilient crops are varieties bred or engineered to withstand extreme weather conditions such as drought, flooding, and extreme heat. Adopting these crops is crucial for maintaining food security in the face of global climate change.'
  }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing
    await Product.deleteMany();
    await Article.deleteMany();
    
    // Insert new
    await Product.insertMany(seedProducts);
    await Article.insertMany(seedArticles);
    
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
