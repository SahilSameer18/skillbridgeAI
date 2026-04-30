import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';

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
        <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
                            S
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            SkillBridge AI
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            to="/" 
                            className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === '/' ? 'text-cyan-400' : 'text-slate-300'}`}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/generate" 
                            className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === '/generate' ? 'text-cyan-400' : 'text-slate-300'}`}
                        >
                            New Plan
                        </Link>
                        <Link
                            to="/dashboard"
                            className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === '/dashboard' ? 'text-cyan-400' : 'text-slate-300'}`}
                        >
                            Dashboard
                        </Link>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-slate-200">{user.username}</span>
                                </div>
                                <button 
                                    onClick={onLogoutClick} 
                                    className="text-sm font-medium text-slate-300 hover:text-red-400 transition-colors"
                                    disabled={logoutLoading}
                                >
                                    {logoutLoading ? "..." : "Logout"}
                                </button>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
                                className="px-5 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-md shadow-purple-500/20"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            className="p-2 rounded-md text-slate-300 hover:text-cyan-400 focus:outline-none" 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link 
                            to="/" 
                            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/30'}`}
                            onClick={closeMobileMenu}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/generate" 
                            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/generate' ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/30'}`}
                            onClick={closeMobileMenu}
                        >
                            New Plan
                        </Link>
                        <Link
                            to="/dashboard"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/dashboard' ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/30'}`}
                            onClick={closeMobileMenu}
                        >
                            Dashboard
                        </Link>
                        
                        {user ? (
                            <div className="pt-4 pb-2 border-t border-slate-800 mt-2">
                                <div className="flex items-center px-3 mb-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-slate-200">{user.username}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={onLogoutClick} 
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800/30 hover:text-red-300"
                                    disabled={logoutLoading}
                                >
                                    {logoutLoading ? "Logging out..." : "Logout"}
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 border-t border-slate-800 mt-2">
                                <Link 
                                    to="/login" 
                                    className="block w-full text-center px-4 py-2 rounded-md text-base font-medium bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                                    onClick={closeMobileMenu}
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
