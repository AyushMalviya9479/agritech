import { Router } from 'express';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler, fail } from '../middleware/error.js';
import { analyzeSoil } from '../utils/soil.js';
const router = Router();
router.use(protect);
const FIELDS = ['name', 'location', 'city', 'sizeInAcres', 'soilType', 'soilPH', 'nitrogen', 'phosphorus', 'potassium'];
const pick = (b) => Object.fromEntries(FIELDS.filter((k) => b[k] !== undefined && b[k] !== '').map((k) => [k, b[k]]));
const mine = async (req, res) => {
  const f = await Farm.findById(req.params.id);
  if (!f) fail(res, 404, 'Farm not found');
  if (String(f.owner) !== String(req.user._id) && req.user.role !== 'admin') fail(res, 403, 'Not your farm');
  return f;
};

router.get('/', asyncHandler(async (req, res) => res.json(await Farm.find({ owner: req.user._id }).sort('-createdAt'))));
router.post('/', asyncHandler(async (req, res) => res.status(201).json(await Farm.create({ ...pick(req.body), owner: req.user._id }))));
router.get('/:id', asyncHandler(async (req, res) => res.json(await mine(req, res))));
router.put('/:id', asyncHandler(async (req, res) => {
  const f = await mine(req, res);
  Object.assign(f, pick(req.body));
  res.json(await f.save());
}));
router.delete('/:id', asyncHandler(async (req, res) => {
  const f = await mine(req, res);
  await Crop.deleteMany({ farm: f._id });
  await f.deleteOne();
  res.json({ message: 'Farm deleted' });
}));
// Soil health analysis
router.get('/:id/soil', asyncHandler(async (req, res) => res.json(analyzeSoil(await mine(req, res)))));
export default router;
