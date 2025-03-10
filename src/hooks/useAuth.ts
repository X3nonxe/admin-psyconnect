export const useAuth = () => {
  const token = localStorage.getItem('token');
  return {
    isAuthenticated: !!token,
    token,
  };
};

// Fungsi untuk logout (opsional)
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
