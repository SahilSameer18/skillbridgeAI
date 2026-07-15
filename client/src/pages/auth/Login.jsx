import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "../../schemas/auth.schema.js";
import LoadingScreen from "../../components/common/LoadingScreen";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const { loginLoading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const [touched, setTouched] = useState({ email: false, password: false });
  const [fieldErrors, setFieldErrors] = useState({ email: null, password: null });

  const navigate = useNavigate();

  const validateField = (name, value) => {
    const fieldSchema = loginSchema.shape[name];
    const result = fieldSchema.safeParse(value);
    const err = result.success ? null : result.error.errors[0].message;
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setError(null);
    if (touched.email) validateField("email", val);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setError(null);
    if (touched.password) validateField("password", val);
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, name === "email" ? email : password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    setTouched({ email: true, password: true });
    
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = { email: null, password: null };
      result.error.errors.forEach((err) => {
        const path = err.path[0];
        if (!errors[path]) {
          errors[path] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({ email: null, password: null });

    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  if (loginLoading) {
    return (
      <LoadingScreen
        message="Authenticating your profile..."
        subtitle="Verifying credentials and establishing a secure session."
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col lg:flex-row">
      {/* Left Section - Branding & Visuals (Hidden on small screens) */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between bg-surface/30 p-12 relative overflow-hidden border-r border-white/[0.04]">
        {/* Abstract Glowing Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#fe9a00]/10 rounded-full blur-[140px] animate-pulse-slow delay-500" />
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0gMjAgMCBMMCAwIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-50" />
        </div>

        <div className="relative z-10 animate-fade-in-up">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <span className="text-2xl font-bold text-primary tracking-wide">
              Skill<span className="text-accent">Bridge</span> <span className="font-light text-white/70">AI</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 mt-auto mb-10 animate-fade-in-up delay-200">
          <h2 className="text-[2.75rem] font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Master your <br /> next interview with <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fe9a00]">
              AI intelligence.
            </span>
          </h2>
          <p className="text-secondary/90 text-lg mb-10 max-w-md font-light leading-relaxed">
            Join thousands of professionals who use our AI-driven platform to practice, refine, and confidently land their dream roles.
          </p>
          
          <div className="flex items-center gap-5">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=11" alt="User" className="w-11 h-11 rounded-full border-2 border-background shadow-lg" />
              <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-11 h-11 rounded-full border-2 border-background shadow-lg" />
              <img src="https://i.pravatar.cc/100?img=47" alt="User" className="w-11 h-11 rounded-full border-2 border-background shadow-lg" />
              <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-11 h-11 rounded-full border-2 border-background shadow-lg" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-secondary/80 font-medium mt-0.5">Trusted by 10k+ users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Logo (Shown only on small screens) */}
        <div className="absolute top-8 left-6 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-lg font-bold text-primary">SkillBridge</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] animate-fade-in-up delay-100">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-3">
              Welcome back
            </h1>
            <p className="text-secondary/80 text-base">
              Please enter your details to sign in to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white/90">
                Email
              </label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within/input:text-accent transition-colors duration-300">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur("email")}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className={`w-full pl-12 pr-4 py-3.5 bg-surface/50 border rounded-xl text-primary placeholder-secondary/40 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/60 transition-all duration-300 ${
                    fieldErrors.email && touched.email 
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10 bg-red-500/5' 
                      : 'border-white/[0.08] hover:border-white/[0.15]'
                  }`}
                />
              </div>
              {touched.email && fieldErrors.email && (
                <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1.5 animate-fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-white/90">
                  Password
                </label>
                <Link to="#" className="text-sm font-medium text-accent hover:text-[#fe9a00] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within/input:text-accent transition-colors duration-300">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-12 pr-12 py-3.5 bg-surface/50 border rounded-xl text-primary placeholder-secondary/40 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/60 transition-all duration-300 ${
                    fieldErrors.password && touched.password 
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10 bg-red-500/5' 
                      : 'border-white/[0.08] hover:border-white/[0.15]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-primary transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1.5 animate-fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 mt-4 rounded-xl font-semibold text-white bg-gradient-to-r from-accent to-[#fe9a00] hover:from-accent hover:to-[#eb8e00] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-[0_10px_25px_rgba(255,102,98,0.25)] hover:shadow-[0_15px_35px_rgba(255,102,98,0.35)] flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-secondary/80 mt-10 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent font-semibold hover:text-orange-400 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

