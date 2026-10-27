export function analyzeSoil(f) {
  const tips = [];
  const { soilPH: ph, nitrogen: n, phosphorus: p, potassium: k, soilType } = f;
  if (ph != null) {
    if (ph < 5.5) tips.push({ item: 'pH', status: 'Acidic', advice: 'Apply agricultural lime to raise pH.' });
    else if (ph > 7.5) tips.push({ item: 'pH', status: 'Alkaline', advice: 'Apply gypsum or elemental sulphur and organic compost.' });
    else tips.push({ item: 'pH', status: 'Good', advice: 'pH is in the ideal range (5.5 - 7.5).' });
  }
  const level = (v, low, high) => (v < low ? 'Low' : v > high ? 'High' : 'Medium');
  if (n != null) { const s = level(n, 280, 560); tips.push({ item: 'Nitrogen', status: s, advice: s === 'Low' ? 'Add urea / compost / green manure.' : s === 'High' ? 'Skip nitrogen fertilizer this season.' : 'Adequate nitrogen.' }); }
  if (p != null) { const s = level(p, 10, 25); tips.push({ item: 'Phosphorus', status: s, advice: s === 'Low' ? 'Add DAP or single super phosphate.' : s === 'High' ? 'No phosphorus needed.' : 'Adequate phosphorus.' }); }
  if (k != null) { const s = level(k, 108, 280); tips.push({ item: 'Potassium', status: s, advice: s === 'Low' ? 'Add muriate of potash (MOP).' : s === 'High' ? 'No potassium needed.' : 'Adequate potassium.' }); }
  const suggest = { clay: ['Rice', 'Wheat', 'Sugarcane'], sandy: ['Groundnut', 'Watermelon', 'Millet'], loamy: ['Wheat', 'Maize', 'Vegetables', 'Pulses'], black: ['Cotton', 'Soybean', 'Sorghum'], red: ['Millet', 'Pulses', 'Groundnut'] };
  return { tips, suggestedCrops: suggest[soilType] || [] };
}
