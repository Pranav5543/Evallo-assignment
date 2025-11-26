import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Teams(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name:'', description:'' });
  const [employees, setEmployees] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [assigned, setAssigned] = useState([]);

  useEffect(()=>{ load(); }, []);

  async function load(){
    const [tres, eres] = await Promise.all([api.get('/teams'), api.get('/employees')]);
    setList(tres.data);
    setEmployees(eres.data);
  }

  async function save(e){
    e.preventDefault();
    if(form.id) await api.put('/teams/' + form.id, form);
    else await api.post('/teams', form);
    setForm({ name:'', description:'' });
    load();
  }

  function openAssign(team){
    setSelectedTeam(team);
    setAssigned((team.employees || []).map(e=>e.id));
  }

  async function toggleAssign(empId){
    if(!selectedTeam) return;
    let endpoint = '/teams/' + selectedTeam.id + '/assign';
    if(assigned.includes(empId)){
      await api.post('/teams/' + selectedTeam.id + '/unassign', { employeeId: empId });
    } else {
      await api.post('/teams/' + selectedTeam.id + '/assign', { employeeId: empId });
    }
    await load();
    const t = (await api.get('/teams')).data.find(x=>x.id===selectedTeam.id);
    setSelectedTeam(t);
    setAssigned((t.employees || []).map(e=>e.id));
  }

  async function remove(id){ await api.delete('/teams/' + id); load(); }

  return (
    <div className="panel">
      <h3>Teams</h3>
      <form className="inline-form" onSubmit={save}>
        <input placeholder="Team name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <button type="submit">{form.id ? 'Update' : 'Add'}</button>
      </form>

      <div className="list">
        {list.map(team=>(
          <div key={team.id} className="list-item">
            <div>
              <strong>{team.name}</strong>
              <div className="muted">{team.description}</div>
              <div className="muted small">Members: {(team.employees||[]).length}</div>
            </div>
            <div className="actions">
              <button onClick={()=>openAssign(team)}>Assign</button>
              <button onClick={()=>remove(team.id)} className="danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className="panel assign">
          <h4>Assign to {selectedTeam.name}</h4>
          <div className="list small">
            {employees.map(e=>(
              <label key={e.id} className="assign-row">
                <input type="checkbox" checked={assigned.includes(e.id)} onChange={()=>toggleAssign(e.id)} />
                <span>{e.first_name} {e.last_name} <span className="muted small">{e.email}</span></span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
