import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext.jsx';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const color = { high: 'danger', medium: 'warning', low: 'success' };

export default function Dashboard() {
  const { user, t } = useAuth();
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [err, setErr] = useState('');

  const getWeather = async (c) => {
    setErr('');
    try { setWeather((await api.get('/weather', { params: { city: c } })).data); } catch (e) { setErr(errMsg(e)); setWeather(null); }
  };
  useEffect(() => {
    Promise.all([api.get('/farms'), api.get('/crops')]).then(([f, c]) => {
      setFarms(f.data); setCrops(c.data);
      if (f.data[0]) { setCity(f.data[0].city); getWeather(f.data[0].city); }
    });
  }, []);

  const count = (s) => crops.filter((c) => c.status === s).length;
  const farm = farms[0];
  return (
    <>
      <h4 className="mb-3">{t('welcome')}, {user.name} 👋</h4>
      <div className="row g-3 mb-3">
        {[['🏡', t('farms'), farms.length], ['🌱', t('crops'), crops.length], ['✅', 'Harvested', count('harvested')]].map(([i, l, v]) => (
          <div className="col-4" key={l}><div className="card stat p-3"><div className="small text-muted">{i} {l}</div><h3 className="mb-0">{v}</h3></div></div>
        ))}
      </div>
      <div className="row g-3">
        <div className="col-lg-6"><div className="card p-3 h-100">
          <h6>🌦️ {t('weather')}</h6>
          <div className="input-group mb-3">
            <input className="form-control" placeholder={t('city')} value={city} onChange={(e) => setCity(e.target.value)} />
            <button className="btn btn-success" onClick={() => city && getWeather(city)}>{t('check')}</button>
          </div>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          {weather && (<>
            <div className="d-flex justify-content-between">
              <div><h2 className="mb-0">{Math.round(weather.temperature)}°C</h2><small className="text-muted">{weather.description}</small></div>
              <div className="text-end small">💧 {weather.humidity}%<br />💨 {weather.windSpeed} m/s</div>
            </div>
            <hr />
            {weather.alerts.map((a, i) => <div key={i} className={`alert alert-${color[a.level]} py-2 mb-2`}><b>{a.type}:</b> {a.msg}</div>)}
            {weather.source === 'demo' && <small className="text-muted">Demo data (add OPENWEATHER_API_KEY in backend for live weather)</small>}
          </>)}
        </div></div>
        <div className="col-lg-3 col-md-6"><div className="card p-3 h-100">
          <h6>{t('cropStatus')}</h6>
          {crops.length ? <Doughnut data={{ labels: ['Sown', 'Growing', 'Harvested'], datasets: [{ data: [count('sown'), count('growing'), count('harvested')], backgroundColor: ['#ffc107', '#43a047', '#8d6e63'] }] }} /> : <p className="text-muted">No crops yet</p>}
        </div></div>
        <div className="col-lg-3 col-md-6"><div className="card p-3 h-100">
          <h6>{t('soilNutrients')}</h6>
          {farm ? <Bar options={{ plugins: { legend: { display: false } } }} data={{ labels: ['N', 'P', 'K'], datasets: [{ data: [farm.nitrogen || 0, farm.phosphorus || 0, farm.potassium || 0], backgroundColor: ['#1e88e5', '#fb8c00', '#8e24aa'] }] }} /> : <p className="text-muted">Add a farm first</p>}
          {farm && <small className="text-muted">{farm.name}</small>}
        </div></div>
      </div>
    </>
  );
}
