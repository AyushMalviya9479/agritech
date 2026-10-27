import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext.jsx';

export default function Store() {
  const { t } = useAuth();
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState('');
  const [cart, setCart] = useState({}); // {productId: qty}
  const [address, setAddress] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => { api.get('/products', { params: { category: cat } }).then((r) => setProducts(r.data)); }, [cat]);

  const all = Object.fromEntries(products.map((p) => [p._id, p]));
  const add = (p) => setCart((c) => ({ ...c, [p._id]: Math.min((c[p._id] || 0) + 1, p.stock) }));
  const remove = (id) => setCart((c) => { const n = { ...c }; n[id] > 1 ? n[id]-- : delete n[id]; return n; });
  const total = Object.entries(cart).reduce((s, [id, q]) => s + (all[id]?.price || 0) * q, 0);

  const order = async () => {
    setErr('');
    try {
      await api.post('/orders', { items: Object.entries(cart).map(([product, quantity]) => ({ product, quantity })), address });
      alert('Order placed!'); nav('/orders');
    } catch (e) { setErr(errMsg(e)); }
  };

  return (
    <div className="row g-3">
      <div className="col-lg-8">
        <select className="form-select mb-3" style={{ maxWidth: 220 }} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>{['seeds', 'fertilizer', 'pesticide', 'equipment'].map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="row g-3">
          {products.map((p) => (
            <div className="col-md-6" key={p._id}><div className="card p-3 h-100">
              <h6>{p.name}</h6><small className="text-muted">{p.category} • {p.description}</small>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <b>₹{p.price}</b>
                {p.stock > 0 ? <button className="btn btn-sm btn-success" onClick={() => add(p)}>{t('addToCart')}</button> : <span className="badge bg-secondary">Out of stock</span>}
              </div>
            </div></div>
          ))}
        </div>
      </div>
      <div className="col-lg-4"><div className="card p-3">
        <h6>🛒 Cart</h6>
        {Object.keys(cart).length === 0 && <small className="text-muted">Cart is empty</small>}
        {Object.entries(cart).map(([id, q]) => (
          <div key={id} className="d-flex justify-content-between small mb-1">
            <span>{all[id]?.name} × {q}</span>
            <span>₹{(all[id]?.price || 0) * q} <button className="btn btn-sm p-0 text-danger" onClick={() => remove(id)}>✖</button></span>
          </div>
        ))}
        <hr /><div className="mb-2">{t('total')}: <b>₹{total}</b></div>
        <textarea className="form-control mb-2" placeholder={t('address')} value={address} onChange={(e) => setAddress(e.target.value)} />
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <button className="btn btn-success" disabled={!total || !address} onClick={order}>{t('placeOrder')}</button>
      </div></div>
    </div>
  );
}
