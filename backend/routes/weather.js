import { Router } from 'express';
import WeatherData from '../models/WeatherData.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler, fail } from '../middleware/error.js';
import { pestAlerts } from '../utils/alerts.js';
const router = Router();
router.use(protect);

// GET /api/weather?city=Indore
router.get('/', asyncHandler(async (req, res) => {
  const city = (req.query.city || '').trim();
  if (!city) fail(res, 400, 'city is required');
  let w, source = 'live';
  const key = process.env.OPENWEATHER_API_KEY;
  if (key) {
    const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`);
    if (r.status === 404) fail(res, 404, 'City not found');
    if (!r.ok) fail(res, 502, 'Weather service error');
    const d = await r.json();
    w = { temperature: d.main.temp, humidity: d.main.humidity, windSpeed: d.wind.speed, description: d.weather[0].description };
  } else { // demo data when no API key
    source = 'demo';
    w = { temperature: 31, humidity: 82, windSpeed: 3.2, description: 'partly cloudy (demo data)' };
  }
  await WeatherData.create({ city, ...w, source });
  res.json({ city, ...w, source, alerts: pestAlerts(w) });
}));
// Recent saved readings for charts
router.get('/history', asyncHandler(async (req, res) => {
  res.json(await WeatherData.find({ city: new RegExp(`^${(req.query.city || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }).sort('-date').limit(10));
}));
export default router;
