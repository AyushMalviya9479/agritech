import mongoose from 'mongoose';
const cropSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  sowingDate: { type: Date, required: true },
  expectedHarvestDate: Date,
  status: { type: String, enum: ['sown', 'growing', 'harvested'], default: 'sown' },
  expectedYield: Number,
  notes: String,
}, { timestamps: true });
export default mongoose.model('Crop', cropSchema);
