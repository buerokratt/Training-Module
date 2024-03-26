import axios, { AxiosError } from 'axios';

let url = import.meta.env.REACT_APP_RUUTER_API_URL;
if (import.meta.env.REACT_APP_LOCAL === 'true') {
  url = '/generic';
}

const instance = axios.create({
  baseURL: url,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (axiosResponse) => {
    import.meta.env.DEBUG_ENABLED && console.log(axiosResponse);
    return axiosResponse;
  },
  (error: AxiosError) => {
    import.meta.env.DEBUG_ENABLED && console.log(error);
    return Promise.reject(error);
  }
);

instance.interceptors.request.use(
  (axiosRequest) => {
    import.meta.env.DEBUG_ENABLED && console.log(axiosRequest);
    return axiosRequest;
  },
  (error: AxiosError) => {
    import.meta.env.DEBUG_ENABLED && console.log(error);
    if (error.response?.status === 401) {
      //TODO: handle unauthorized requests
    }
    if (error.response?.status === 403) {
      //TODO: handle unauthorized requests
    }
    return Promise.reject(error);
  }
);

export default instance;
