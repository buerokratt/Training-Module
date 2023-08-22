import axios, { AxiosError } from 'axios';

let URL: string;
if (import.meta.env.REACT_APP_MODE === 'development-mock') {
  URL = import.meta.env.BASE_URL + 'api/';
} else {
  URL = import.meta.env.REACT_APP_RUUTER_URL + 'rasa/';
}

const instance = axios.create({
  baseURL: URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      //TODO: handle unauthorized requests
    }
    return Promise.reject(error);
  },
);

export default instance;
