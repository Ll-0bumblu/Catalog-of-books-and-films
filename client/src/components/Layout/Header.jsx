import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import '../../styles/Layout.css';
import appLogo from '../../images/app-logo.svg'
import userLogo from '../../images/user-logo.png'


const Header = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" className="logo-link"> <img src={appLogo} alt="app logo" className='app-logo' /> Каталог </Link>
        </div>
        
        <nav className="nav">
          {user ? (
            <>
              <img src={userLogo} alt="" className='user-logo' />
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="logout-button">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Войти</Link>
              <Link to="/register" className="nav-link register-link">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;