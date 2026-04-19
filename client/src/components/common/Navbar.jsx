import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import './navbar.scss';

const Navbar = () => {
    const { handleLogout, user, logoutLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const onLogoutClick = async () => {
        await handleLogout();
        navigate('/login');
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className="global-navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
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
                            <div className="mobile-menu-wrapper">
                                <button 
                                    className="hamburger-btn" 
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    aria-label="Toggle menu"
                                >
                                    <span className="hamburger-line"></span>
                                    <span className="hamburger-line"></span>
                                    <span className="hamburger-line"></span>
                                </button>
                                
                                {mobileMenuOpen && (
                                    <div className="mobile-menu-dropdown">
                                        <Link 
                                            to="/" 
                                            className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                            onClick={closeMobileMenu}
                                        >
                                            Home
                                        </Link>
                                        <Link 
                                            to="/generate" 
                                            className={`mobile-nav-link ${location.pathname === '/generate' ? 'active' : ''}`}
                                            onClick={closeMobileMenu}
                                        >
                                            New Plan
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className={`mobile-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                            onClick={closeMobileMenu}
                                        >
                                            Dashboard
                                        </Link>
                                        <button onClick={onLogoutClick} className="mobile-logout-btn" disabled={logoutLoading}>
                                            {logoutLoading ? "Logging out..." : "Logout"}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button onClick={onLogoutClick} className="btn-logout" disabled={logoutLoading}>
                                {logoutLoading ? "Logging out..." : "Logout"}
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
