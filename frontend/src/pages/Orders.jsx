import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext.jsx';

const steps = ['pending', 'approved', 'shipped', 'delivered'];
export default function Orders() {
  const { t } = useAuth();
  const [orders, setOrders] = useState([]);
  const load = () => api.get('/orders/my').then((r) => setOrders(r.data));
  useEffect(() => { load(); }, []);
  const cancel = async (id) => { try { await api.put(`/orders/${id}/cancel`); load(); } catch (e) { alert(errMsg(e)); } };

  return (
    <>
      <h4 className="mb-3">{t('orders')}</h4>
      {orders.length === 0 && <p className="text-muted">No orders yet.</p>}
      {orders.map((o) => (
        <div className="card p-3 mb-3" key={o._id}>
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              {o.items.map((i) => <div key={i._id}>{i.name} × {i.quantity}</div>)}
              <small className="text-muted">{new Date(o.createdAt).toLocaleString()} • {o.address}</small>
              <div><b>₹{o.totalAmount}</b></div>
            </div>
            <div className="text-end">
              <span className={`badge ${o.status === 'cancelled' ? 'bg-danger' : 'bg-success'}`}>{o.status}</span>
              {o.status === 'pending' && <div><button className="btn btn-sm btn-outline-danger mt-2" onClick={() => cancel(o._id)}>{t('cancel')}</button></div>}
            </div>
          </div>
          {o.status !== 'cancelled' && (
            <div className="progress mt-3" style={{ height: 6 }}>
              <div className="progress-bar bg-success" style={{ width: `${((steps.indexOf(o.status) + 1) / steps.length) * 100}%` }} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
