import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext.jsx';

const empty = { farm: '', name: '', sowingDate: '', expectedHarvestDate: '', status: 'sown', expectedYield: '', notes: '' };
const d = (v) => (v ? String(v).slice(0, 10) : '');
const color = { sown: 'warning', growing: 'success', harvested: 'secondary' };

export default function Crops() {
  const { t } = useAuth();
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [f, setF] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api.get('/crops').then((r) => setCrops(r.data));
  useEffect(() => { load(); api.get('/farms').then((r) => setFarms(r.data)); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    setErr('');
    try {
      editId ? await api.put(`/crops/${editId}`, f) : await api.post('/crops', f);
      setF(empty); setEditId(null); load();
    } catch (e) { setErr(errMsg(e)); }
  };
  const quick = async (c, status) => { await api.put(`/crops/${c._id}`, { status }); load(); };
  const del = async (id) => { if (confirm('Delete crop?')) { await api.delete(`/crops/${id}`); load(); } };

  return (
    <div className="row g-3">
      <div className="col-lg-4"><div className="card p-3">
        <h6>{editId ? t('edit') : t('add')} Crop</h6>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <select className="form-select mb-2" value={f.farm?._id || f.farm} onChange={set('farm')}>
          <option value="">Select farm</option>{farms.map((x) => <option key={x._id} value={x._id}>{x.name}</option>)}
        </select>
        <input className="form-control mb-2" placeholder="Crop name" value={f.name} onChange={set('name')} />
        <label className="small text-muted">Sowing date</label>
        <input className="form-control mb-2" type="date" value={d(f.sowingDate)} onChange={set('sowingDate')} />
        <label className="small text-muted">Expected harvest</label>
        <input className="form-control mb-2" type="date" value={d(f.expectedHarvestDate)} onChange={set('expectedHarvestDate')} />
        <select className="form-select mb-2" value={f.status} onChange={set('status')}>{['sown', 'growing', 'harvested'].map((s) => <option key={s}>{s}</option>)}</select>
        <input className="form-control mb-2" type="number" placeholder="Expected yield (kg)" value={f.expectedYield} onChange={set('expectedYield')} />
        <textarea className="form-control mb-2" placeholder="Notes (irrigation, fertilizer, pests...)" value={f.notes} onChange={set('notes')} />
        <button className="btn btn-success" onClick={save}>{t('save')}</button>
        {editId && <button className="btn btn-link" onClick={() => { setEditId(null); setF(empty); }}>{t('cancel')}</button>}
      </div></div>
      <div className="col-lg-8">
        {crops.length === 0 && <p className="text-muted">No crops yet. Add a farm first, then add crops.</p>}
        {crops.map((c) => (
          <div className="card p-3 mb-3" key={c._id}>
            <div className="d-flex justify-content-between flex-wrap">
              <div>
                <h6 className="mb-0">{c.name} <span className={`badge bg-${color[c.status]}`}>{c.status}</span></h6>
                <small className="text-muted">{c.farm?.name} • Sown {d(c.sowingDate)} {c.expectedHarvestDate && `• Harvest ${d(c.expectedHarvestDate)}`} {c.expectedYield && `• ${c.expectedYield} kg`}</small>
                {c.notes && <div className="small">{c.notes}</div>}
              </div>
              <div>
                {c.status === 'sown' && <button className="btn btn-sm btn-outline-success me-1" onClick={() => quick(c, 'growing')}>Mark growing</button>}
                {c.status === 'growing' && <button className="btn btn-sm btn-outline-success me-1" onClick={() => quick(c, 'harvested')}>Mark harvested</button>}
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => { setEditId(c._id); setF({ ...empty, ...c, farm: c.farm?._id }); window.scrollTo(0, 0); }}>{t('edit')}</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => del(c._id)}>{t('delete')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
