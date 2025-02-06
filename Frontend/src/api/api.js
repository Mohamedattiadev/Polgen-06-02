import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Your API base URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout after 10 seconds
});

// Add request interceptor to include token
API.interceptors.request.use((config) => {
  const sessionId = sessionStorage.getItem("sessionId");
  const authKey = `auth_${sessionId}`;
  const userData = JSON.parse(sessionStorage.getItem(authKey));

  if (userData?.token) {
    config.headers.Authorization = `Bearer ${userData.token}`;
  }

  return config;
});

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response, // Return response if no error
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.error("Unauthorized request, redirecting to login.");
      sessionStorage.clear(); // Clear session data
      window.location.href = "/login"; // Redirect to login
    }

    // For other errors, propagate the error
    return Promise.reject(error);
  }
);

export default API;
