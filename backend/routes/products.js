import { Router } from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
const router = Router();
router.use(protect);
router.get('/', asyncHandler(async (req, res) => {
  const f = req.query.category ? { category: req.query.category } : {};
  res.json(await Product.find(f).sort('name'));
}));
router.post('/', adminOnly, asyncHandler(async (req, res) => res.status(201).json(await Product.create(req.body))));
router.put('/:id', adminOnly, asyncHandler(async (req, res) =>
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }))));
router.delete('/:id', adminOnly, asyncHandler(async (req, res) => { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Product deleted' }); }));
export default router;
