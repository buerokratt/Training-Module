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
    import.meta.env.DEBUG_ENABLED && console.log(axiosResponse);
    return axiosResponse;
  },
  (error: AxiosError) => {
    import.meta.env.DEBUG_ENABLED && console.log(error);
    return  Promise.reject(new Error(error.message));
  }
);

formInstance.interceptors.request.use(
  (axiosRequest) => {
    import.meta.env.DEBUG_ENABLED && console.log(axiosRequest);
    return axiosRequest;
  },
  (error: AxiosError) => {
    import.meta.env.DEBUG_ENABLED && console.log(error);
    if (error.response?.status === 401) {
      // handle unauthorized requests
    }
    if (error.response?.status === 403) {
      // handle unauthorized requests
    }
    return  Promise.reject(new Error(error.message));
  }
);

export default formInstance;
