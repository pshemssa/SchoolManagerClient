import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout')
};

export const feeService = {
  deposit: (data) => api.post('/fee/deposit', data),
  withdraw: (data) => api.post('/fee/withdraw', data),
  getBalance: (studentId) => api.get(`/fee/balance/${studentId}`),
  getHistory: (studentId) => api.get(`/fee/history/${studentId}`)
};

export const studentService = {
  getProfile: (studentId) => api.get(`/student/${studentId}/profile`),
  getGrades: (studentId) => api.get(`/student/${studentId}/grades`),
  getAttendance: (studentId) => api.get(`/student/${studentId}/attendance`),
  getTimetable: (studentId) => api.get(`/student/${studentId}/timetable`)
};

export default api;
