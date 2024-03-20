import axios, {AxiosInstance} from "axios";
import {getToken, removeToken} from "@/utils/authUtils";

const createApiInstance = (): AxiosInstance => {
    const instance = axios.create();

    instance.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    instance.interceptors.request.use((config) => {
        // const token = getToken();
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjc2VxdWVpcmExNTNAZ21haWwuY29tIiwiZXhwIjoxNzExNDk5NTE4fQ.IR6K8VZI3QKzY40YJKhDXWNud7sDz3fbtrhnOpZftyg";

        if (token) {
            config.headers.setAuthorization(`Bearer ${token}`);
        }

        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            const token = getToken();

            if (error.response && error.response.status === 401 && token) {
                removeToken();
            }

            return Promise.reject(error);
        },
    );

    return instance;
};

const api = createApiInstance();
export default api;
