import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext.jsx';

export default function Forum() {
  const { user, t } = useAuth();
  const [tab, setTab] = useState('forum');
  const [posts, setPosts] = useState([]);
  const [p, setP] = useState({ title: '', body: '' });
  const [comment, setComment] = useState({});
  const [err, setErr] = useState('');
  const load = () => api.get('/posts', { params: { category: tab } }).then((r) => setPosts(r.data));
  useEffect(() => { load(); }, [tab]);

  const create = async () => {
    setErr('');
    try { await api.post('/posts', { ...p, category: tab }); setP({ title: '', body: '' }); load(); } catch (e) { setErr(errMsg(e)); }
  };
  const reply = async (id) => {
    if (!comment[id]) return;
    try { await api.post(`/posts/${id}/comments`, { text: comment[id] }); setComment({ ...comment, [id]: '' }); load(); } catch (e) { alert(errMsg(e)); }
  };
  const del = async (id) => { if (confirm('Delete post?')) { await api.delete(`/posts/${id}`); load(); } };

  return (
    <>
      <div className="btn-group mb-3">
        <button className={`btn ${tab === 'forum' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setTab('forum')}>{t('community')}</button>
        <button className={`btn ${tab === 'consultation' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setTab('consultation')}>{t('ask')}</button>
      </div>
      <div className="card p-3 mb-3">
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <input className="form-control mb-2" placeholder="Title" value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} />
        <textarea className="form-control mb-2" placeholder={tab === 'forum' ? 'Share something with farmers...' : 'Describe your problem for the expert...'} value={p.body} onChange={(e) => setP({ ...p, body: e.target.value })} />
        <div><button className="btn btn-success" onClick={create}>{t('add')}</button></div>
      </div>
      {posts.map((x) => (
        <div className="card p-3 mb-3" key={x._id}>
          <div className="d-flex justify-content-between">
            <div><h6 className="mb-0">{x.title}</h6><small className="text-muted">{x.author?.name} • {new Date(x.createdAt).toLocaleString()}</small></div>
            {(user.role === 'admin' || x.author?._id === user._id) && <button className="btn btn-sm btn-outline-danger" onClick={() => del(x._id)}>{t('delete')}</button>}
          </div>
          <p className="mt-2">{x.body}</p>
          {x.comments.map((c) => <div key={c._id} className="small border-start ps-2 mb-1">{c.isExpert && <span className="badge bg-primary me-1">Expert</span>}<b>{c.authorName}:</b> {c.text}</div>)}
          <div className="input-group mt-2">
            <input className="form-control form-control-sm" placeholder="Write a reply..." value={comment[x._id] || ''} onChange={(e) => setComment({ ...comment, [x._id]: e.target.value })} />
            <button className="btn btn-sm btn-outline-success" onClick={() => reply(x._id)}>Reply</button>
          </div>
        </div>
      ))}
      {posts.length === 0 && <p className="text-muted">Nothing here yet.</p>}
    </>
  );
}
