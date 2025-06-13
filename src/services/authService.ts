import axios from 'axios';

const API_URL = 'https://psy-backend-production.up.railway.app/api/v1/auth';

// Buat instance axios khusus untuk auth
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fungsi login
export const login = async (email: string, password: string) => {
  try {
    const response = await authAxios.post('/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Terjadi kesalahan saat login' };
  }
};

// Fungsi refresh token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('Tidak ada refresh token yang tersedia');
    }

    const response = await authAxios.post('/refresh-token', {
      refresh_token: refreshToken
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: 'Gagal memperbarui token. Silakan login kembali'
    };
  }
};

// Fungsi logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
};