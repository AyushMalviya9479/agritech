import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

const emptyP = { name: '', category: 'seeds', price: '', stock: '', description: '' };
export default function Admin() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [p, setP] = useState(emptyP);
  const [msg, setMsg] = useState('');
  const load = () => {
    api.get('/admin/stats').then((r) => setStats(r.data));
    api.get('/admin/users').then((r) => setUsers(r.data));
    api.get('/orders').then((r) => setOrders(r.data));
    api.get('/products').then((r) => setProducts(r.data));
  };
  useEffect(() => { load(); }, []);
  const run = async (fn, after) => { try { await fn(); setMsg('✅ Done'); after?.(); load(); } catch (e) { setMsg('❌ ' + errMsg(e)); } };

  return (
    <>
      <h4>Admin Dashboard</h4>
      {msg && <div className="alert alert-info py-2">{msg}</div>}
      <div className="row g-2 mb-4">
        {Object.entries(stats).map(([k, v]) => <div className="col-4 col-md-2" key={k}><div className="card stat p-2 text-center"><small className="text-muted">{k}</small><h5 className="mb-0">{v}</h5></div></div>)}
      </div>

      <h6>Orders (approve / ship / deliver)</h6>
      <div className="table-responsive mb-4"><table className="table table-sm bg-white">
        <thead><tr><th>User</th><th>Items</th><th>₹</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{orders.map((o) => (
          <tr key={o._id}><td>{o.user?.name}</td><td>{o.items.map((i) => `${i.name}×${i.quantity}`).join(', ')}</td><td>{o.totalAmount}</td><td>{o.status}</td>
            <td><select className="form-select form-select-sm" value="" onChange={(e) => e.target.value && run(() => api.put(`/orders/${o._id}/status`, { status: e.target.value }))}>
              <option value="">Change...</option>{['approved', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s}>{s}</option>)}</select></td></tr>
        ))}</tbody></table></div>

      <h6>Products</h6>
      <div className="card p-3 mb-2"><div className="row g-2">
        <div className="col-md-3"><input className="form-control" placeholder="Name" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></div>
        <div className="col-md-2"><select className="form-select" value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })}>{['seeds', 'fertilizer', 'pesticide', 'equipment'].map((c) => <option key={c}>{c}</option>)}</select></div>
        <div className="col-md-2"><input className="form-control" type="number" placeholder="Price" value={p.price} onChange={(e) => setP({ ...p, price: e.target.value })} /></div>
        <div className="col-md-2"><input className="form-control" type="number" placeholder="Stock" value={p.stock} onChange={(e) => setP({ ...p, stock: e.target.value })} /></div>
        <div className="col-md-3"><button className="btn btn-success w-100" onClick={() => run(() => api.post('/products', { ...p, price: +p.price, stock: +p.stock }), () => setP(emptyP))}>Add product</button></div>
      </div></div>
      <div className="table-responsive mb-4"><table className="table table-sm bg-white"><tbody>
        {products.map((x) => <tr key={x._id}><td>{x.name}</td><td>{x.category}</td><td>₹{x.price}</td><td>Stock: {x.stock}</td>
          <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => run(() => api.delete(`/products/${x._id}`))}>Delete</button></td></tr>)}
      </tbody></table></div>

      <h6>Users</h6>
      <div className="table-responsive"><table className="table table-sm bg-white">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th /></tr></thead>
        <tbody>{users.map((u) => (
          <tr key={u._id}><td>{u.name}</td><td>{u.email}</td>
            <td><select className="form-select form-select-sm" value={u.role} onChange={(e) => run(() => api.put(`/admin/users/${u._id}/role`, { role: e.target.value }))}><option>farmer</option><option>admin</option></select></td>
            <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => confirm('Delete user and data?') && run(() => api.delete(`/admin/users/${u._id}`))}>Delete</button></td></tr>
        ))}</tbody></table></div>
    </>
  );
}
