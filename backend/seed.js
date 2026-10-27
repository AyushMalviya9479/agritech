import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Farm from './models/Farm.js';
import Crop from './models/Crop.js';
import Product from './models/Product.js';
import Post from './models/Post.js';
import Order from './models/Order.js';
import WeatherData from './models/WeatherData.js';
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
await Promise.all([User, Farm, Crop, Product, Post, Order, WeatherData].map((m) => m.deleteMany()));

const admin = await User.create({ name: 'Admin Expert', email: 'admin@agritech.com', password: 'admin123', role: 'admin' });
const farmer = await User.create({ name: 'Ramesh Kumar', email: 'farmer@agritech.com', password: 'farmer123' });
const farm = await Farm.create({ owner: farmer._id, name: 'Green Valley Farm', location: 'Village Rau', city: 'Indore', sizeInAcres: 5, soilType: 'black', soilPH: 7.8, nitrogen: 250, phosphorus: 18, potassium: 300 });
await Crop.create([
  { farm: farm._id, owner: farmer._id, name: 'Soybean', sowingDate: new Date(Date.now() - 40 * 864e5), expectedHarvestDate: new Date(Date.now() + 60 * 864e5), status: 'growing', expectedYield: 1200 },
  { farm: farm._id, owner: farmer._id, name: 'Wheat', sowingDate: new Date(), status: 'sown', expectedYield: 2000 },
]);
await Product.insertMany([
  { name: 'Hybrid Wheat Seeds (10kg)', category: 'seeds', price: 650, stock: 100, description: 'High yield variety' },
  { name: 'Urea (50kg)', category: 'fertilizer', price: 300, stock: 200, description: 'Nitrogen fertilizer' },
  { name: 'DAP (50kg)', category: 'fertilizer', price: 1350, stock: 150, description: 'Phosphorus + nitrogen' },
  { name: 'Neem Oil Pesticide (1L)', category: 'pesticide', price: 420, stock: 80, description: 'Organic pest control' },
  { name: 'Hand Sprayer 16L', category: 'equipment', price: 1800, stock: 40, description: 'Knapsack sprayer' },
]);
const post = await Post.create({ author: farmer._id, category: 'forum', title: 'Best time to sow wheat in black soil?', body: 'Which month is best in Malwa region?', comments: [] });
await Post.create({ author: farmer._id, category: 'consultation', title: 'Yellow leaves on soybean', body: 'Leaves are turning yellow after 40 days. What should I do?' });
console.log('Seeded! Admin: admin@agritech.com / admin123 | Farmer: farmer@agritech.com / farmer123');
process.exit(0);
