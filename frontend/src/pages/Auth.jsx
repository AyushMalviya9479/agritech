import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { errMsg } from '../api';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { login, register, t } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async () => {
    setErr(''); setBusy(true);
    try {
      if (isLogin) await login(f.email, f.password); else await register(f.name, f.email, f.password);
      nav(loc.state?.from || '/');
    } catch (e) { setErr(errMsg(e)); }
    setBusy(false);
  };
  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: 400 }}>
      <h4 className="mb-3">{isLogin ? t('login') : t('register')}</h4>
      {err && <div className="alert alert-danger py-2">{err}</div>}
      {!isLogin && <input className="form-control mb-2" placeholder={t('name')} value={f.name} onChange={set('name')} />}
      <input className="form-control mb-2" type="email" placeholder={t('email')} value={f.email} onChange={set('email')} />
      <input className="form-control mb-3" type="password" placeholder={t('password')} value={f.password} onChange={set('password')} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      <button className="btn btn-success" disabled={busy} onClick={submit}>{busy ? '...' : isLogin ? t('login') : t('register')}</button>
      <div className="mt-3 small">{isLogin ? <Link to="/register">New farmer? Register</Link> : <Link to="/login">Already registered? Login</Link>}</div>
    </div>
  );
}
