import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Employees(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'', phone:'' });

  useEffect(()=>{ load(); }, []);

  async function load(){ const res = await api.get('/employees'); setList(res.data); }

  async function save(e){
    e.preventDefault();
    if(form.id){
      await api.put('/employees/' + form.id, form);
    } else {
      await api.post('/employees', form);
    }
    setForm({ first_name:'', last_name:'', email:'', phone:'' });
    load();
  }

  async function edit(it){ setForm(it); }
  async function remove(id){ await api.delete('/employees/' + id); load(); }

  return (
    <div className="panel">
      <h3>Employees</h3>
      <form className="inline-form" onSubmit={save}>
        <input placeholder="First name" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})} />
        <input placeholder="Last name" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        <button type="submit">{form.id ? 'Update' : 'Add'}</button>
      </form>

      <div className="list">
        {list.map(it=>(
          <div key={it.id} className="list-item">
            <div>
              <strong>{it.first_name} {it.last_name}</strong>
              <div className="muted">{it.email} • {it.phone}</div>
              <div className="muted small">Teams: {(it.teams || []).map(t=>t.name).join(', ')}</div>
            </div>
            <div className="actions">
              <button onClick={()=>edit(it)}>Edit</button>
              <button onClick={()=>remove(it.id)} className="danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
