import axios, {AxiosError} from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.REACT_APP_RUUTER_URL + 'generic/',
    headers: {
        Accept: 'application/json',
    },
    withCredentials: true,
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {

        }
        return Promise.reject(error);
    },
);

export default instance;
