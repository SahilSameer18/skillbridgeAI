import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import './navbar.scss';

const Navbar = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const onLogoutClick = () => {
        handleLogout();
        navigate('/login');
    };

    return (
        <nav className="global-navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-logo">🚀</span>
                    <span className="brand-name">SkillBridge AI</span>
                </Link>

                <div className="navbar-links">
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/generate" 
                        className={`nav-link ${location.pathname === '/generate' ? 'active' : ''}`}
                    >
                        New Plan
                    </Link>
                    <Link
                        to="/dashboard"
                        className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                    >
                        Dashboard
                    </Link>
                </div>

                <div className="navbar-actions">
                    <button onClick={onLogoutClick} className="btn-logout">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
