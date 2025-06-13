import axios from 'axios';
import { refreshAccessToken, logout } from './authService';

const API_URL = 'https://psy-backend-production.up.railway.app/api/v1';

// Buat instance axios untuk API umum
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Interceptor untuk menambahkan token ke header
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Interceptor untuk menangani token expired
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		console.log('[API Interceptor] Error:', error.config.url, error.response?.status);

		// Jika error 401 dan belum pernah di-retry
		if (error.response?.status === 401 && !originalRequest._retry &&
			!originalRequest.url.includes('/auth/')) {
			console.log('[API Interceptor] 401 detected, attempting refresh...');
			originalRequest._retry = true;

			try {
				// Coba refresh token
				const { access_token } = await refreshAccessToken();

				// Simpan token baru
				localStorage.setItem('token', access_token);

				// Update header dengan token baru
				originalRequest.headers.Authorization = `Bearer ${access_token}`;

				// Ulangi request asli
				return api(originalRequest);
			} catch (refreshError) {
				// Jika refresh gagal, logout
				logout();
				window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default api;