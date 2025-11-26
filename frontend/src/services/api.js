import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
const api = axios.create({ baseURL });

api.interceptors.request.use(cfg => {
  if(typeof window !== 'undefined' && window.localStorage){
    const token = localStorage.getItem('token');
    if(token) cfg.headers.Authorization = `Bearer ${token}`;
    else delete cfg.headers.Authorization;
  }
  return cfg;
});

api.interceptors.response.use(
  res => res,
  err => {
    if(err?.response?.status === 401){
      if(typeof window !== 'undefined' && window.localStorage){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      if(typeof window !== 'undefined') window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default api;
