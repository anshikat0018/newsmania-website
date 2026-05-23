import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/",
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // if(error?)
        return Promise.reject(error)
    }
);

export default api;