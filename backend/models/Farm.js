import mongoose from 'mongoose';
const farmSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  sizeInAcres: { type: Number, required: true, min: 0 },
  soilType: { type: String, enum: ['clay', 'sandy', 'loamy', 'black', 'red'], default: 'loamy' },
  soilPH: Number,
  nitrogen: Number,    // kg/ha
  phosphorus: Number,  // kg/ha
  potassium: Number,   // kg/ha
}, { timestamps: true });
export default mongoose.model('Farm', farmSchema);
