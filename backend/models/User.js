import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  language: { type: String, enum: ['en', 'hi'], default: 'en' },
  phone: String,
}, { timestamps: true });
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = function (p) { return bcrypt.compare(p, this.password); };
export default mongoose.model('User', userSchema);
