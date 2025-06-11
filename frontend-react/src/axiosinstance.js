import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API_URL;

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    function(config) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config; 
    },
    function(error) {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    function(response) {
        return response;
    },
    // Handle failed responses
    async function(error) {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
                try {
                    const response = await axios.post(`${baseURL}/token/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    const newAccessToken = response.data.access;
                    localStorage.setItem('accessToken', newAccessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Refresh token is invalid, clear storage and redirect to login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    
                    // Trigger logout in auth context if available
                    window.location.href = '/login';
                    
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;