import axios from 'axios';

import { API } from '../../config/config'

const axiosInstance = axios.create({
    baseURL: `${API}`
});

// Function to refresh the access token
const refreshAccessToken = async () => {

    const refreshToken = await localStorage.getItem('refresh_token');

    var config = {
        method: 'post',
        url: `/auth/v3/refresh-token`,
        skipInterceptor: true,
        data: {
            refreshToken: refreshToken
        }
    };

    try {
        const response = await axiosInstance(config);
        await localStorage.setItem('access_token', response.data.accessToken);
        return true;
    } catch (error) {
        return false;
    }
};

// Axios request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        
        config.headers['Authorization'] = `Bearer ${accessToken}`
        // config.headers['Accept-Language'] = localStorage.getItem("i18nextLng").split('-')[0];

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const statusCode = error.response.status;

        // Check if the request failed due to an expired access token and if skipInterceptor flag is not set
        if (statusCode === 401 && !originalRequest._retry && !originalRequest.skipInterceptor) {
            originalRequest._retry = true;
            // Refresh the token
            const isTokenRefreshed = await refreshAccessToken();
            if (isTokenRefreshed) {
                // Resend the original request
                return axiosInstance(originalRequest);
            } else {
                return Promise.reject(error);
            }
        }

        // If the refresh fails or another error occurs, reject the promise
        return Promise.reject(error);
    }
);

export { axiosInstance };
