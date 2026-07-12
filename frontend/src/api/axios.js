import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send httpOnly cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor — handle session superseded globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "SESSION_SUPERSEDED"
    ) {
      // Another device logged in — redirect to login
      if (
        window.location.pathname !== "/login" &&
        !window.location.search.includes("session_superseded")
      ) {
        window.location.replace("/login?reason=session_superseded");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
