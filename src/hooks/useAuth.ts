export const useAuth = () => {
  const token = localStorage.getItem('token');

  const isTokenValid = () => {
    if (!token) return false;

    try {
      // Dekode payload JWT untuk cek expiry time
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload) return false;
      const expiryTime = payload.exp * 1000; // Konversi ke milidetik
      return expiryTime > Date.now();
    } catch (error) {
      return false;
    }
  };

  return {
    isAuthenticated: isTokenValid(),
    token,
    role: localStorage.getItem('role') || ''
  };
};

// Fungsi untuk logout (opsional)
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
  window.location.href = '/login';
};