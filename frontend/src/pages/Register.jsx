import React, { useState } from 'react';
import api from '../services/api';

export default function Register({ onRegister }){
  const [orgName, setOrgName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { orgName, adminName: name, email, password });
      onRegister(res.data.token, res.data.user);
    } catch(err){
      setErr(err?.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>Create organisation</h2>
      <input placeholder="Organisation name" value={orgName} onChange={e=>setOrgName(e.target.value)} />
      <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Create</button>
      {err && <div className="error">{err}</div>}
    </form>
  );
}
