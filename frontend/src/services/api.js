import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEmployees = () => api.get('employees/');
export const createEmployee = (data) => api.post('employees/', data);
export const deleteEmployee = (id) => api.delete(`employees/${id}/`);

export const getAttendance = (params) => api.get('attendance/', { params });
export const markAttendance = (data) => api.post('attendance/', data);
export const updateAttendance = (id, data) => api.put(`attendance/${id}/`, data);

export const getDashboardStats = (params) => api.get('dashboard/', { params });
