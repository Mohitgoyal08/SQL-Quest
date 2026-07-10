import axios from 'axios';

// Ensure this matches the backend URL
export const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending/receiving the HTTPOnly refresh token cookie
});

// We store the access token in memory for security
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

// Request interceptor: attach the access token to every request if we have it
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: automatically refresh the token on 401 Unauthorized
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops by not retrying if the request was to the refresh endpoint itself
    if (originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token using the HTTPOnly cookie
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const newToken = data.access_token;
        setAccessToken(newToken);
        
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // If refresh fails, we are logged out (cookie expired or missing)
        setAccessToken(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
