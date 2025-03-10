import { useState } from 'react';
import './navbar.scss';

const Navbar = () => {
  // State untuk toggle dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ambil nama admin dari localStorage atau state management
  const adminName = localStorage.getItem('adminName') || 'Admin';

  // Fungsi untuk handle logout
  const handleLogout = () => {
    // Hapus token/auth dari localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminName');

    // Redirect ke halaman login
    window.location.href = '/login';
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src="logo.svg" alt="" />
        <span>PsyConnect</span>
      </div>
      <div className="icons">
        <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <img src="/expand.svg" alt="" className="icon" />
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div>

        {/* Bagian User dengan Dropdown */}
        <div className="user" onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ cursor: 'pointer', position: 'relative' }}>
          <img src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load" alt="" />
          <span>{adminName}</span>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
            </div>
          )}
        </div>

        <img src="/settings.svg" alt="" className="icon" />
      </div>
    </div>
  );
};

export default Navbar;
