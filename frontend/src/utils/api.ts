import axios, { AxiosInstance, AxiosResponse } from "axios";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    async (config: any) => {

        const token = window.localStorage.getItem("token");

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        config.headers["Content-Type"] = "application/json";
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status > 199 && response.status < 400) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;