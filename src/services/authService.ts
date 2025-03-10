import axios from 'axios';

const API_URL = 'https://basic-kaleena-psyconnect-bda9a59b.koyeb.app/api/auth';

// Fungsi login menggunakan axios
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    // Tangkap kesalahan jaringan atau server
    throw error.response?.data || { message: 'Terjadi kesalahan saat login' };
  }
};
