import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['seeds', 'fertilizer', 'pesticide', 'equipment'], required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  description: String,
}, { timestamps: true });
export default mongoose.model('Product', productSchema);
