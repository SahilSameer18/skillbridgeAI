import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth.js";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/generate", label: "New Plan" },
  { to: "/dashboard", label: "Dashboard" },
];

const Navbar = () => {
  const { handleLogout, user, logoutLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // ── Scroll-aware background ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close menu on outside click ──────────────────────────────────────────
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileMenuOpen]);

  // ── Close menu on route change ───────────────────────────────────────────
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const onLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-800/80 shadow-lg shadow-black/20"
          : "border-b border-slate-800/40"
      }`}
      style={{
        background: scrolled
          ? "rgba(3,7,18,0.92)"
          : "rgba(3,7,18,0.60)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Brand ──────────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-all duration-300 group-hover:scale-105" style={{ background: "linear-gradient(135deg,#06b6d4,#a855f7)" }}
            >
              S
            </div>
            <span
              className="text-lg font-bold tracking-tight text-gradient-cyan"
              style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}
            >
              SkillBridge AI
            </span>
          </Link>

          {/* ── Desktop Links ───────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-cyan-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ background: "linear-gradient(135deg,#06b6d4,#a855f7)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Actions ─────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* User pill */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700/50 transition-colors duration-200"
                  style={{ background: "rgba(30,41,59,0.6)" }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0"
                    style={{ background: "rgba(168,85,247,0.2)" }}
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-200 max-w-[120px] truncate">
                    {user.username}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={onLogoutClick}
                  disabled={logoutLoading}
                  className="px-4 py-1.5 text-sm font-medium rounded-full border border-slate-700/60 text-slate-400 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
                >
                  {logoutLoading ? "Logging out…" : "Logout"}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold rounded-full text-white transition-all duration-200 hover:opacity-90 active:scale-95" style={{ background: "linear-gradient(135deg,#06b6d4,#a855f7)" }}
              >
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile Toggle ───────────────────────────────────────────────── */}
          <button
            ref={toggleRef}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-[5px]">
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>

        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────────────────────── */}
      <div
        ref={menuRef}
        className="md:hidden absolute left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: mobileMenuOpen ? "400px" : "0px",
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
        }}
      >
        <div
          className="border-t border-slate-800/60 px-4 pt-3 pb-5 space-y-1"
          style={{
            background: "rgba(3,7,18,0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Nav links */}
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-cyan-400 bg-cyan-500/10"
                    : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/40"
                }`}
              >
                {isActive && (
                  <span
                    className="w-1 h-4 rounded-full shrink-0" style={{ background: "linear-gradient(135deg,#06b6d4,#a855f7)" }}
                  />
                )}
                {label}
              </Link>
            );
          })}

          {/* User section */}
          <div className="pt-3 mt-1 border-t border-slate-800/60">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-cyan-300 text-sm shrink-0"
                    style={{ background: "rgba(168,85,247,0.15)" }}
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-200 truncate">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={onLogoutClick}
                  disabled={logoutLoading}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 disabled:opacity-50"
                >
                  {logoutLoading ? "Logging out…" : "Logout"}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95" style={{ background: "linear-gradient(135deg,#06b6d4,#a855f7)" }}
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