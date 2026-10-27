import { lazy, Suspense } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

// Code splitting: each page loads only when opened
const Auth = lazy(() => import('./pages/Auth.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Farms = lazy(() => import('./pages/Farms.jsx'));
const Crops = lazy(() => import('./pages/Crops.jsx'));
const Store = lazy(() => import('./pages/Store.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const Forum = lazy(() => import('./pages/Forum.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

function Protected({ children, admin }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, logout, t, lang, changeLang } = useAuth();
  const link = ({ isActive }) => 'nav-link px-2 ' + (isActive ? 'text-warning fw-bold' : 'text-white');
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-agri px-3">
        <span className="navbar-brand fw-bold">🌾 AgriTech</span>
        <div className="d-flex flex-wrap align-items-center gap-1 flex-grow-1">
          {user && (<>
            <NavLink to="/" end className={link}>{t('dashboard')}</NavLink>
            <NavLink to="/farms" className={link}>{t('farms')}</NavLink>
            <NavLink to="/crops" className={link}>{t('crops')}</NavLink>
            <NavLink to="/store" className={link}>{t('store')}</NavLink>
            <NavLink to="/orders" className={link}>{t('orders')}</NavLink>
            <NavLink to="/forum" className={link}>{t('forum')}</NavLink>
            {user.role === 'admin' && <NavLink to="/admin" className={link}>{t('admin')}</NavLink>}
          </>)}
          <div className="ms-auto d-flex gap-2 align-items-center">
            <select className="form-select form-select-sm" style={{ width: 90 }} value={lang} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option><option value="hi">हिन्दी</option>
            </select>
            {user && <button className="btn btn-sm btn-outline-light" onClick={logout}>{t('logout')}</button>}
          </div>
        </div>
      </nav>
      <div className="container py-4">
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
            <Route path="/" element={<Protected><Dashboard /></Protected>} />
            <Route path="/farms" element={<Protected><Farms /></Protected>} />
            <Route path="/crops" element={<Protected><Crops /></Protected>} />
            <Route path="/store" element={<Protected><Store /></Protected>} />
            <Route path="/orders" element={<Protected><Orders /></Protected>} />
            <Route path="/forum" element={<Protected><Forum /></Protected>} />
            <Route path="/admin" element={<Protected admin><Admin /></Protected>} />
            <Route path="*" element={<h4>404 - Page not found</h4>} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}
