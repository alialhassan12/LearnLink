import axios from "axios";

const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized responses
        if (error.response && error.response.status === 401) {
            console.error("Session expired. Logging out.");
            localStorage.removeItem("token");
            // Force reload to login page to clear state
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance