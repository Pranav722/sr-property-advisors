import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for catching global errors (like 401 Unauthorized)
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Handle unauthorized (e.g., redirect to login or clear token)
        console.error('Unauthorized request - redirecting to login');
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Adjust based on routing setup
    }
    return Promise.reject(error);
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    googleLogin: (data) => api.post('/auth/google', data),
    getProfile: () => api.get('/auth/profile')
};

export const projectService = {
    getAll: () => api.get('/projects'),
    getOne: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`)
};

export const locationService = {
    getAll: () => api.get('/locations'),
    create: (data) => api.post('/locations', data)
};

export const leadService = {
    getAll: () => api.get('/inquiries'),
    create: (data) => api.post('/inquiries', data)
};

export default api;
