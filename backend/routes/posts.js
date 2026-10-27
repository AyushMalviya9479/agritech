import { Router } from 'express';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler, fail } from '../middleware/error.js';
const router = Router();
router.use(protect);

router.get('/', asyncHandler(async (req, res) => {
  const f = {};
  if (req.query.category) f.category = req.query.category;
  // consultations are private: farmers see only their own, admin (expert) sees all
  if (req.query.category === 'consultation' && req.user.role !== 'admin') f.author = req.user._id;
  res.json(await Post.find(f).populate('author', 'name').sort('-createdAt'));
}));
router.post('/', asyncHandler(async (req, res) => {
  const { title, body, category } = req.body;
  if (!title || !body) fail(res, 400, 'Title and body required');
  res.status(201).json(await Post.create({ title, body, category: category === 'consultation' ? 'consultation' : 'forum', author: req.user._id }));
}));
router.post('/:id/comments', asyncHandler(async (req, res) => {
  const p = await Post.findById(req.params.id);
  if (!p) fail(res, 404, 'Post not found');
  if (p.category === 'consultation' && req.user.role !== 'admin' && String(p.author) !== String(req.user._id)) fail(res, 403, 'Private consultation');
  if (!req.body.text) fail(res, 400, 'Comment text required');
  p.comments.push({ author: req.user._id, authorName: req.user.name, isExpert: req.user.role === 'admin', text: req.body.text });
  await p.save();
  res.status(201).json(p);
}));
// delete: owner or admin (moderation)
router.delete('/:id', asyncHandler(async (req, res) => {
  const p = await Post.findById(req.params.id);
  if (!p) fail(res, 404, 'Post not found');
  if (String(p.author) !== String(req.user._id) && req.user.role !== 'admin') fail(res, 403, 'Not allowed');
  await p.deleteOne();
  res.json({ message: 'Post deleted' });
}));
export default router;
