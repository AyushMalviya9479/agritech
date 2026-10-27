import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, price: Number,
    quantity: { type: Number, min: 1 },
  }],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);
