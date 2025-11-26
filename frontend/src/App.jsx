import React, { useState, useCallback } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App(){
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  const persistSession = useCallback((nextToken, nextUser) => {
    if(nextToken) localStorage.setItem('token', nextToken); else localStorage.removeItem('token');
    if(nextUser) localStorage.setItem('user', JSON.stringify(nextUser)); else localStorage.removeItem('user');
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  if(!token) {
    return (
      <div className="app-shell">
        <div className="auth-single">
          <div className="auth-heading">
            <div>
              <div className="logo-pill">Evallo HRMS</div>
              <h2>{mode === 'login' ? 'Welcome back' : 'Create organisation'}</h2>
              <p className="muted">
                {mode === 'login'
                  ? 'Sign in to access your organisation workspace.'
                  : 'Set up a new tenant to start managing your teams.'}
              </p>
            </div>
          </div>
          <div className="auth-card auth-card__single">
            {mode === 'login'
              ? <Login onLogin={(t,u)=>persistSession(t, u)} />
              : <Register onRegister={(t,u)=>persistSession(t, u)} />}
            <div className="auth-switch">
              {mode === 'login' ? (
                <>
                  <span>New to Evallo?</span>
                  <button type="button" onClick={()=>setMode('register')}>Create organisation</button>
                </>
              ) : (
                <>
                  <span>Already onboarded?</span>
                  <button type="button" onClick={()=>setMode('login')}>Back to sign in</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={() => persistSession(null, null)} user={user} />;
}
