import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {

  const context = useContext(AuthContext);

  const { user, setUser, loading, loginLoading, setLoginLoading, registerLoading, setRegisterLoading, logoutLoading, setLogoutLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoginLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
    } catch (err) {
      setLoginLoading(false);
      // Re-throw so Login.jsx can catch and show error
      throw err;
    }
    setLoginLoading(false);
  };

  const handleRegister = async ({ username, email, password }) => {
    setRegisterLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
    } catch (err) {
      setRegisterLoading(false);
      // Re-throw so Register.jsx can catch and show error
      throw err;
    }
    setRegisterLoading(false);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      setUser(null);
    } catch {
      // Silent — clear user state regardless
      setUser(null);
    } finally {
      setLogoutLoading(false);
    }
  };

  return { user, loading, loginLoading, registerLoading, logoutLoading, handleRegister, handleLogin, handleLogout };
};
