import { Router } from 'express';
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import Order from '../models/Order.js';
import Post from '../models/Post.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, fail } from '../middleware/error.js';
const router = Router();
router.use(protect, adminOnly);

router.get('/stats', asyncHandler(async (req, res) => {
  const [users, farms, crops, orders, posts, pending] = await Promise.all([
    User.countDocuments(), Farm.countDocuments(), Crop.countDocuments(), Order.countDocuments(), Post.countDocuments(), Order.countDocuments({ status: 'pending' }),
  ]);
  res.json({ users, farms, crops, orders, posts, pendingOrders: pending });
}));
router.get('/users', asyncHandler(async (req, res) => res.json(await User.find().select('-password').sort('-createdAt'))));
router.put('/users/:id/role', asyncHandler(async (req, res) => {
  if (!['farmer', 'admin'].includes(req.body.role)) fail(res, 400, 'Invalid role');
  if (String(req.params.id) === String(req.user._id)) fail(res, 400, 'You cannot change your own role');
  res.json(await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password'));
}));
router.delete('/users/:id', asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) fail(res, 400, 'You cannot delete yourself');
  await Promise.all([Farm.deleteMany({ owner: req.params.id }), Crop.deleteMany({ owner: req.params.id }), User.findByIdAndDelete(req.params.id)]);
  res.json({ message: 'User and their data deleted' });
}));
export default router;
