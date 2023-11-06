import axios from 'axios';

const formInstance = axios.create({
    baseURL: import.meta.env.REACT_APP_RUUTER_URL + 'rasa/',
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
});

formInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            return null;
        }
        return Promise.reject(error);
    },
);

export default formInstance;
