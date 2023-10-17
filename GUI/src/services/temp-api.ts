import axios, {AxiosError} from 'axios';

const testCookie = 'bearer ' + (localStorage.getItem('token') || 'test');

const instance = axios.create({
    baseURL: import.meta.env.REACT_APP_RUUTER_URL + 'rasa/',
    headers: {
        Accept: 'application/json',
        Testcookie: ''
    },
    withCredentials: true,
});

instance.interceptors.request.use((config) => {
    config.headers['Testcookie'] = testCookie;
    //config.headers.host = import.meta.env.REACT_APP_RUUTER_URL;
    return config;
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

// const get = (url: string, config?: object) => {
//     return instance.get(url, config);
// };

export default instance;
