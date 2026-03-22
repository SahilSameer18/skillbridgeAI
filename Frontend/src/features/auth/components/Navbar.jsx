import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import './navbar.scss';

const Navbar = () => {
    const { handleLogout, user } = useAuth();
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
                    {user ? (
                        <>
                            <div className="user-chip">
                                <div className="user-chip__avatar">
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                                <span className="user-chip__name">{user.username}</span>
                            </div>
                            <button onClick={onLogoutClick} className="btn-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-login-nav">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

