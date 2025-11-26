import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Employees from './Employees';
import Teams from './Teams';

export default function Dashboard({ onLogout, user }){
  const [view, setView] = useState('employees');

  async function logout(){
    try { await api.post('/auth/logout', { userId: user.id, orgId: user.organisationId }); } catch(e){}
    onLogout();
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="brand">Evallo HRMS</div>
        <div className="controls">
          <button onClick={()=>setView('employees')}>Employees</button>
          <button onClick={()=>setView('teams')}>Teams</button>
          <button onClick={logout} className="btn-quiet">Sign out</button>
        </div>
      </header>

      <main className="main">
        {view === 'employees' ? <Employees /> : <Teams />}
      </main>
    </div>
  );
}
