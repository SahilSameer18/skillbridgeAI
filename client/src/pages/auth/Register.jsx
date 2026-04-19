import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import "./auth.form.scss";

const Register = () => {
  const navigate = useNavigate();
  const { registerLoading, handleRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await handleRegister({ username, email, password });
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    }
  };

  if (registerLoading) {
    return (
      <main className="loading-screen animate-fade-in">
        <div className="spinner"></div>
        <h2 className="text-gradient">Creating account...</h2>
      </main>
    );
  }

  return (
    <main className="animate-fade-in">
      <div className="form-container animate-fade-in-up">
        <Link to="/" className="auth-logo-link">
          <span className="auth-logo-link__icon">🚀</span>
          <span className="auth-logo-link__name text-gradient">SkillBridge AI</span>
        </Link>
        <h1 className="text-gradient">Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="button primary-button" type="submit" disabled={registerLoading}>
            {registerLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p>
          Already have an account? <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;

