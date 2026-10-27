import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
const router = Router();
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const out = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, language: u.language, token: sign(u._id) });

router.post('/register',
  [body('name').notEmpty().withMessage('Name required'),
   body('email').isEmail().withMessage('Valid email required'),
   body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')],
  asyncHandler(async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ message: errs.array()[0].msg });
    const { name, email, password, language, phone } = req.body;
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone, language: language === 'hi' ? 'hi' : 'en' }); // role always farmer
    res.status(201).json(out(user));
  }));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await user.matchPassword(password || ''))) return res.status(401).json({ message: 'Invalid email or password' });
  res.json(out(user));
}));
router.get('/me', protect, (req, res) => res.json(req.user));
router.put('/language', protect, asyncHandler(async (req, res) => {
  req.user.language = req.body.language === 'hi' ? 'hi' : 'en';
  await req.user.save();
  res.json({ language: req.user.language });
}));
export default router;
