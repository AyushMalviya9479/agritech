import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext.jsx';

const empty = { name: '', location: '', city: '', sizeInAcres: '', soilType: 'loamy', soilPH: '', nitrogen: '', phosphorus: '', potassium: '' };
const badge = { Low: 'danger', Medium: 'success', High: 'warning', Good: 'success', Acidic: 'danger', Alkaline: 'warning' };

export default function Farms() {
  const { t } = useAuth();
  const [farms, setFarms] = useState([]);
  const [f, setF] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [report, setReport] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api.get('/farms').then((r) => setFarms(r.data));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    setErr('');
    try {
      editId ? await api.put(`/farms/${editId}`, f) : await api.post('/farms', f);
      setF(empty); setEditId(null); load();
    } catch (e) { setErr(errMsg(e)); }
  };
  const del = async (id) => { if (confirm('Delete farm and its crops?')) { await api.delete(`/farms/${id}`); load(); } };
  const soil = async (farm) => setReport({ farm, ...(await api.get(`/farms/${farm._id}/soil`)).data });

  return (
    <div className="row g-3">
      <div className="col-lg-4"><div className="card p-3">
        <h6>{editId ? t('edit') : t('add')} Farm</h6>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <input className="form-control mb-2" placeholder="Farm name" value={f.name} onChange={set('name')} />
        <input className="form-control mb-2" placeholder="Location / village" value={f.location} onChange={set('location')} />
        <input className="form-control mb-2" placeholder="City (for weather)" value={f.city} onChange={set('city')} />
        <input className="form-control mb-2" type="number" placeholder="Size (acres)" value={f.sizeInAcres} onChange={set('sizeInAcres')} />
        <select className="form-select mb-2" value={f.soilType} onChange={set('soilType')}>
          {['clay', 'sandy', 'loamy', 'black', 'red'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <div className="row g-2 mb-2">
          {[['soilPH', 'pH'], ['nitrogen', 'N'], ['phosphorus', 'P'], ['potassium', 'K']].map(([k, l]) => (
            <div className="col-6" key={k}><input className="form-control" type="number" step="0.1" placeholder={l} value={f[k]} onChange={set(k)} /></div>
          ))}
        </div>
        <button className="btn btn-success" onClick={save}>{t('save')}</button>
        {editId && <button className="btn btn-link" onClick={() => { setEditId(null); setF(empty); }}>{t('cancel')}</button>}
      </div></div>
      <div className="col-lg-8">
        {farms.length === 0 && <p className="text-muted">No farms yet. Add your first farm.</p>}
        {farms.map((x) => (
          <div className="card p-3 mb-3" key={x._id}>
            <div className="d-flex justify-content-between flex-wrap">
              <div><h6 className="mb-0">{x.name}</h6><small className="text-muted">{x.location}, {x.city} • {x.sizeInAcres} acres • {x.soilType} soil</small></div>
              <div>
                <button className="btn btn-sm btn-outline-success me-1" onClick={() => soil(x)}>{t('soilReport')}</button>
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => { setEditId(x._id); setF({ ...empty, ...x }); window.scrollTo(0, 0); }}>{t('edit')}</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => del(x._id)}>{t('delete')}</button>
              </div>
            </div>
            {report?.farm._id === x._id && (
              <div className="mt-3">
                {report.tips.length === 0 && <small className="text-muted">Add pH / N / P / K values to get a report.</small>}
                {report.tips.map((s) => <div key={s.item} className="mb-1"><span className={`badge bg-${badge[s.status]} me-2`}>{s.item}: {s.status}</span><small>{s.advice}</small></div>)}
                <div className="mt-2"><b>Suggested crops:</b> {report.suggestedCrops.join(', ')}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
