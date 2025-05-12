import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import 'react-toastify/dist/ReactToastify.css';
import './login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login Admin</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email" disabled={loading} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Kata Sandi</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan kata sandi" disabled={loading} />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
