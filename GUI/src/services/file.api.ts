import axios, { AxiosError } from 'axios';

const formInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_RUUTER_URL + 'rasa/',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});

formInstance.interceptors.response.use(
  (axiosResponse) => {
    process.env.DEBUG_ENABLED && console.log(axiosResponse);
    return axiosResponse;
  },
  (error: AxiosError) => {
    process.env.DEBUG_ENABLED && console.log(error);
    return Promise.reject(error);
  }
);

formInstance.interceptors.request.use(
  (axiosRequest) => {
    process.env.DEBUG_ENABLED && console.log(axiosRequest);
    return axiosRequest;
  },
  (error: AxiosError) => {
    process.env.DEBUG_ENABLED && console.log(error);
    if (error.response?.status === 401) {
      //TODO: handle unauthorized requests
    }
    if (error.response?.status === 403) {
      //TODO: handle unauthorized requests
    }
    return Promise.reject(error);
  }
);

export default formInstance;
