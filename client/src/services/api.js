import axios from "axios";

/**
 * Centralized Axios instance for SkillBridge AI client.
 * Configured with base URL, credential handling, and default timeouts.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 45000, // 45 seconds for long-running AI generation and PDF processing
});

export default api;
