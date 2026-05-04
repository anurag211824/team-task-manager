import axios from "axios";

// ================= AXIOS INSTANCE =================
export const apiClient = axios.create({
  baseURL: "/api", // change if needed (e.g. process.env.NEXT_PUBLIC_API_URL)
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ================= REQUEST INTERCEPTOR =================
apiClient.interceptors.request.use(
  (config) => {
    // Get token (client-side only)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors
    if (error.response?.status === 401) {
      console.warn("Unauthorized → logging out");

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");

        // Optional: redirect to login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);