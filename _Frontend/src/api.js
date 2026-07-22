import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 403 && !err.response?.data?.message) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password });
export const createUser = (data) => api.post('/api/auth/register', data);

export const createVoucher = (data) => api.post('/api/vouchers', data);
export const getMyVouchers = () => api.get('/api/vouchers/my');
export const getAllVouchers = () => api.get('/api/vouchers');
export const getVoucher = (id) => api.get(`/api/vouchers/${id}`);
export const updateVoucher = (id, data) => api.put(`/api/vouchers/${id}`, data);
export const deleteVoucher = (id) => api.delete(`/api/vouchers/${id}`);
export const submitVoucher = (id) => api.put(`/api/vouchers/${id}/submit`);
export const uploadSignature = (id, file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post(`/api/vouchers/${id}/signature`, form);
};
export const uploadDirectorSignature = (id, file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post(`/api/vouchers/${id}/director-signature`, form);
};
export const approveVoucher = (id) => api.put(`/api/vouchers/${id}/approve`);
export const rejectVoucher = (id, reason) => api.put(`/api/vouchers/${id}/reject`, { reason });
export const getVouchersByStatus = (status) => api.get(`/api/vouchers/status/${status}`);

export default api;
