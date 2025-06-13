import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import 'react-toastify/dist/ReactToastify.css';
import './login.scss';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email dan kata sandi harus diisi.');
      return;
    }

    setLoading(true);
    toast.info('Memproses login...');

    try {
      const data = await login(email, password);

      if (data && data.access_token) {
        // Validasi role pengguna
        if (data.user.role !== 'admin') {
          toast.error('Akses ditolak: Anda bukan admin.');
          setLoading(false);
          return;
        }

        // Simpan token dan informasi pengguna jika role adalah admin
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('email', data.user.email);

        toast.success('Login berhasil!');

        setTimeout(() => {
          setLoading(false);
          navigate('/');
        }, 1000);
      } else {
        toast.error('Login gagal. Periksa kembali kredensial Anda.');
        setLoading(false);
      }
    } catch (error) {
      toast.error((error as any).message || 'Terjadi kesalahan.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-header">
          <div className="logo-container">
            <div className="admin-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor" />
                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <h2>Login Admin</h2>
          <p className="subtitle">Selamat datang kembali</p>
        </div>

        <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
          <label htmlFor="email">
            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Email
          </label>
          <div className="input-wrapper">
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} placeholder="admin@example.com" disabled={loading} />
          </div>
        </div>

        <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
          <label htmlFor="password">
            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
            </svg>
            Kata Sandi
          </label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              placeholder="••••••••"
              disabled={loading}
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z" stroke="currentColor" strokeWidth="2" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.65-6.65a3 3 0 0 0-4.24-4.24L9.9 4.24z" stroke="currentColor" strokeWidth="2" />
                  <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button type="submit" className={`login-button ${loading ? 'loading' : ''}`} disabled={loading}>
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}
          <span>{loading ? 'Memproses...' : 'Masuk'}</span>
        </button>

        <div className="form-footer">
          <a href="#" className="forgot-password">
            Lupa kata sandi?
          </a>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </div>
  );
};

export default Login;
