import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:3000/api";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // or true if your API requires cookies
});

// Attach auth token to every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers!["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Optional: global response error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Axios wraps errors differently
    if (error.response) {
      // Server returned a response
      return Promise.reject({
        message: error.response.data.message || error.message,
        statusCode: error.response.status,
        errors: error.response.data.errors || [],
      });
    }
    return Promise.reject(error);
  }
);
