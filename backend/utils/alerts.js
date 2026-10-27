// Simple rule-based pest / weather alerts
export function pestAlerts({ temperature: t, humidity: h, windSpeed: w, description: d = '' }) {
  const a = [];
  if (h > 80 && t >= 20 && t <= 30) a.push({ level: 'high', type: 'Fungal disease', msg: 'High humidity + warm weather: risk of blight and mildew. Inspect leaves and consider a preventive fungicide.' });
  if (h > 70 && t > 30) a.push({ level: 'medium', type: 'Pest outbreak', msg: 'Hot and humid: aphids and whiteflies multiply fast. Monitor crops daily.' });
  if (t > 38) a.push({ level: 'high', type: 'Heat stress', msg: 'Extreme heat: irrigate in early morning/evening and use mulch.' });
  if (t < 8) a.push({ level: 'high', type: 'Frost risk', msg: 'Low temperature: cover young plants and avoid irrigation at night.' });
  if (h < 30) a.push({ level: 'medium', type: 'Dry spell', msg: 'Very low humidity: increase irrigation frequency; watch for spider mites.' });
  if (w > 8) a.push({ level: 'medium', type: 'Strong wind', msg: 'Avoid spraying pesticides today; support tall crops.' });
  if (/rain|storm|drizzle/i.test(d)) a.push({ level: 'low', type: 'Rain expected', msg: 'Postpone spraying and fertilizer application; ensure field drainage.' });
  if (!a.length) a.push({ level: 'low', type: 'All clear', msg: 'Weather is favourable for farm work today.' });
  return a;
}
