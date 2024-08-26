import axios, { AxiosError } from 'axios';
import {useTranslation} from "react-i18next";
import {useEffect} from "react";

const api = axios.create({
  baseURL: import.meta.env.REACT_APP_RUUTER_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const authApi = axios.create({
  baseURL: import.meta.env.REACT_APP_AUTH_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const fileApi = axios.create({
  baseURL: import.meta.env.REACT_APP_RUUTER_URL + 'rasa/',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});

const genericApi = axios.create({
  baseURL: import.meta.env.REACT_APP_RUUTER_URL + 'generic/',
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
});

const rasaApi = axios.create({
  baseURL: import.meta.env.REACT_APP_RUUTER_URL + 'rasa/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const AxiosInterceptor = ({ children }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const resInterceptor = (response: any) => {
      import.meta.env.DEBUG_ENABLED && console.debug(response);

      return response;
    }

    const errInterceptor = (error: any) => {
      import.meta.env.DEBUG_ENABLED && console.debug(error);

      let message = t('global.notificationErrorMsg');

      return Promise.reject(new Error(message));
    }

    const apiInterceptor = api.interceptors.response.use(resInterceptor, errInterceptor);
    const authApiInterceptor = authApi.interceptors.response.use(resInterceptor, errInterceptor);
    const fileApiInterceptor = fileApi.interceptors.response.use(resInterceptor, errInterceptor);
    const genericInterceptor = genericApi.interceptors.response.use(resInterceptor, errInterceptor);
    const rasaApiInterceptor = rasaApi.interceptors.response.use(resInterceptor, errInterceptor);

    return () => {
      api.interceptors.response.eject(apiInterceptor);
      authApi.interceptors.response.eject(authApiInterceptor);
      fileApi.interceptors.response.eject(fileApiInterceptor);
      genericApi.interceptors.response.eject(genericInterceptor);
      rasaApi.interceptors.response.eject(rasaApiInterceptor);
    };

  }, [t]);

  return children;
}

const handleRequestError = (error: AxiosError) => {
  import.meta.env.DEBUG_ENABLED && console.debug(error);
  if (error.response?.status === 401) {
    // To be added: handle unauthorized requests
  }
  if (error.response?.status === 403) {
    // To be added: handle forbidden requests
  }
  return Promise.reject(new Error(error.message));
}

api.interceptors.request.use(
  (axiosRequest) => axiosRequest,
  handleRequestError
);

authApi.interceptors.request.use(
  (axiosRequest) => axiosRequest,
  handleRequestError
);

fileApi.interceptors.request.use(
  (axiosRequest) => axiosRequest,
  handleRequestError
);

genericApi.interceptors.request.use(
  (axiosRequest) => axiosRequest,
  handleRequestError
);

rasaApi.interceptors.request.use(
  (axiosRequest) => axiosRequest,
  handleRequestError
);

export { api, authApi, fileApi, genericApi, rasaApi, AxiosInterceptor };
