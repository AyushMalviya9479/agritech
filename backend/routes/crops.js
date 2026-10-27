import { Router } from 'express';
import Crop from '../models/Crop.js';
import Farm from '../models/Farm.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler, fail } from '../middleware/error.js';
const router = Router();
router.use(protect);
const FIELDS = ['farm', 'name', 'sowingDate', 'expectedHarvestDate', 'status', 'expectedYield', 'notes'];
const pick = (b) => Object.fromEntries(FIELDS.filter((k) => b[k] !== undefined && b[k] !== '').map((k) => [k, b[k]]));
const ownFarm = async (req, res, farmId) => {
  const f = await Farm.findById(farmId);
  if (!f || String(f.owner) !== String(req.user._id)) fail(res, 403, 'Invalid farm');
};
const mine = async (req, res) => {
  const c = await Crop.findById(req.params.id);
  if (!c) fail(res, 404, 'Crop not found');
  if (String(c.owner) !== String(req.user._id)) fail(res, 403, 'Not your crop');
  return c;
};

router.get('/', asyncHandler(async (req, res) => {
  const f = { owner: req.user._id };
  if (req.query.farm) f.farm = req.query.farm;
  res.json(await Crop.find(f).populate('farm', 'name').sort('-createdAt'));
}));
router.post('/', asyncHandler(async (req, res) => {
  await ownFarm(req, res, req.body.farm);
  res.status(201).json(await Crop.create({ ...pick(req.body), owner: req.user._id }));
}));
router.put('/:id', asyncHandler(async (req, res) => {
  const c = await mine(req, res);
  if (req.body.farm) await ownFarm(req, res, req.body.farm);
  Object.assign(c, pick(req.body));
  res.json(await c.save());
}));
router.delete('/:id', asyncHandler(async (req, res) => {
  await (await mine(req, res)).deleteOne();
  res.json({ message: 'Crop deleted' });
}));
export default router;
