import mongoose from 'mongoose';
const weatherSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  temperature: Number, humidity: Number, windSpeed: Number, description: String,
  source: { type: String, default: 'live' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.model('WeatherData', weatherSchema);
