import { createContext, useContext, useState } from 'react';
import api from './api';
import { makeT } from './i18n';
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || user?.language || 'en');
  const save = (d) => { localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(d)); setUser(d); changeLang(d.language || 'en', false); };
  const login = async (email, password) => save((await api.post('/auth/login', { email, password })).data);
  const register = async (name, email, password) => save((await api.post('/auth/register', { name, email, password, language: lang })).data);
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };
  const changeLang = (l, sync = true) => {
    setLang(l); localStorage.setItem('lang', l);
    if (sync && localStorage.getItem('token')) api.put('/auth/language', { language: l }).catch(() => {});
  };
  return <Ctx.Provider value={{ user, login, register, logout, lang, changeLang, t: makeT(lang) }}>{children}</Ctx.Provider>;
}
