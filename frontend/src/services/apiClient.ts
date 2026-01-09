import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => apiClient(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = Cookies.get('refreshToken');

            if (!refreshToken) {
                isRefreshing = false;
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
                    { refreshToken }
                );

                const newAccessToken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken;

                // Store both tokens in cookies
                Cookies.set('accessToken', newAccessToken, { expires: 1 / 24, path: '/', sameSite: 'Lax', secure: false }); // 1 hour
                Cookies.set('refreshToken', newRefreshToken, { expires: 7, path: '/', sameSite: 'Lax', secure: false }); // 7 days

                // Update the failed request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                isRefreshing = false;

                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                isRefreshing = false;
                Cookies.remove('accessToken', { path: '/' });
                Cookies.remove('refreshToken', { path: '/' });
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
