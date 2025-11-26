import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ onLogin }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data.token, res.data.user);
    } catch(err){
      setErr(err?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>Sign in</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Sign in</button>
      {err && <div className="error">{err}</div>}
    </form>
  );
}
