import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, fail } from '../middleware/error.js';
const router = Router();
router.use(protect);

// Place order: price is read from DB (never trust client price)
router.post('/', asyncHandler(async (req, res) => {
  const { items, address } = req.body;
  if (!Array.isArray(items) || !items.length) fail(res, 400, 'Cart is empty');
  if (!address) fail(res, 400, 'Address required');
  const lines = []; let total = 0; const reserved = [];
  try {
    for (const it of items) {
      const qty = parseInt(it.quantity, 10);
      if (!qty || qty < 1) fail(res, 400, 'Invalid quantity');
      // atomic stock decrement
      const p = await Product.findOneAndUpdate({ _id: it.product, stock: { $gte: qty } }, { $inc: { stock: -qty } }, { new: true });
      if (!p) fail(res, 400, 'Product unavailable or insufficient stock');
      reserved.push({ id: p._id, qty });
      lines.push({ product: p._id, name: p.name, price: p.price, quantity: qty });
      total += p.price * qty;
    }
    res.status(201).json(await Order.create({ user: req.user._id, items: lines, totalAmount: total, address }));
  } catch (e) {
    for (const r of reserved) await Product.findByIdAndUpdate(r.id, { $inc: { stock: r.qty } }); // rollback
    throw e;
  }
}));
router.get('/my', asyncHandler(async (req, res) => res.json(await Order.find({ user: req.user._id }).sort('-createdAt'))));
router.put('/:id/cancel', asyncHandler(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o || String(o.user) !== String(req.user._id)) fail(res, 404, 'Order not found');
  if (o.status !== 'pending') fail(res, 400, 'Only pending orders can be cancelled');
  for (const i of o.items) await Product.findByIdAndUpdate(i.product, { $inc: { stock: i.quantity } });
  o.status = 'cancelled';
  res.json(await o.save());
}));
// Admin
router.get('/', adminOnly, asyncHandler(async (req, res) => res.json(await Order.find().sort('-createdAt').limit(100).populate('user', 'name email'))));
router.put('/:id/status', adminOnly, asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'shipped', 'delivered', 'cancelled'].includes(status)) fail(res, 400, 'Invalid status');
  res.json(await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }));
}));
export default router;
