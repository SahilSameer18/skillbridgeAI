import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth.js";
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/generate", label: "New Plan" },
  { to: "/dashboard", label: "Dashboard" },
];

const getDiceBearAvatar = (seed) =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "User")}`;

const Navbar = () => {
  const { handleLogout, user, logoutLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 12;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileMenuOpen]);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }

  const onLogoutClick = async () => {
    setUserMenuOpen(false);
    await handleLogout();
    navigate("/login");
  };

  const avatarSrc = user?.avatar || getDiceBearAvatar(user?.username);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.08] shadow-2xl shadow-black/60"
          : "border-b border-transparent"
      }`}
      style={{
        background: scrolled ? "rgba(8, 8, 10, 0.92)" : "rgba(8, 8, 10, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 active:scale-[0.98] transition-transform">
            <div className="w-8 h-8 rounded-lg bg-[#0e0e12] border-t border-white/[0.16] border-x border-b border-white/[0.06] flex items-center justify-center shadow-md group-hover:border-accent/40 transition-colors">
              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-primary">
              Skill<span className="text-accent">Bridge</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-160 active:scale-[0.97] ${
                    isActive
                      ? "text-white"
                      : "text-secondary hover:text-primary hover:bg-white/[0.04]"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-accent shadow-[0_0_8px_rgba(255,102,98,0.7)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions / User Profile Pill */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-160 cursor-pointer active:scale-[0.97]"
                >
                  <img
                    src={avatarSrc}
                    alt={user.username}
                    className="w-6 h-6 rounded-full object-cover shrink-0 border border-accent/40"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getDiceBearAvatar(user.username);
                    }}
                  />
                  <span className="text-sm font-medium text-primary max-w-[120px] truncate">
                    {user.username}
                  </span>
                  <FiChevronDown className={`w-3.5 h-3.5 text-secondary transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl studio-card p-1.5 z-50 animate-fade-in shadow-2xl">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-primary hover:bg-white/[0.06] hover:text-accent transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiUser className="w-4 h-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={onLogoutClick}
                      disabled={logoutLoading}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <FiLogOut className="w-4 h-4" />
                      {logoutLoading ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="studio-btn-primary px-5 py-2 text-sm rounded-full"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            ref={toggleRef}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg text-secondary hover:text-accent hover:bg-surface transition-all duration-200 focus:outline-none"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-[5px]">
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className="md:hidden absolute left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out z-50"
        style={{
          maxHeight: mobileMenuOpen ? "400px" : "0px",
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
        }}
      >
        <div className="border-t border-border px-4 pt-3 pb-5 space-y-1 bg-background/95 backdrop-blur-xl">
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? "text-accent bg-accent/10" : "text-secondary hover:text-primary hover:bg-surface"
                }`}
              >
                {isActive && <span className="w-1 h-4 rounded-full bg-accent shrink-0" />}
                {label}
              </Link>
            );
          })}

          {user && (
            <Link
              to="/profile"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === "/profile" ? "text-accent bg-accent/10" : "text-secondary hover:text-primary hover:bg-surface"
              }`}
            >
              <FiUser className="w-4 h-4" />
              Profile
            </Link>
          )}

          <div className="pt-3 mt-1 border-t border-border">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={avatarSrc}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover border border-accent/40"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getDiceBearAvatar(user.username);
                    }}
                  />
                  <span className="text-sm font-medium text-primary truncate">{user.username}</span>
                </div>
                <button
                  onClick={onLogoutClick}
                  disabled={logoutLoading}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  {logoutLoading ? "Logging out…" : "Logout"}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-primary bg-accent transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
