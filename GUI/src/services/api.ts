import axios from 'axios';
import {useTranslation} from "react-i18next";
import {useEffect} from "react";

const instance = axios.create({
  baseURL: import.meta.env.REACT_APP_RUUTER_URL + 'rasa/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// @ts-ignore
const AxiosInterceptor = ({ children }) => {
  const { t } = useTranslation();

  useEffect(() => {

    const resInterceptor = (response: any) => {
      import.meta.env.DEBUG_ENABLED && console.log(response);

      return response;
    }

    const errInterceptor = (error: any) => {
      import.meta.env.DEBUG_ENABLED && console.log(error);

      if (error.response?.status === 409) {
        let message = t('axios.error.conflict');
        return Promise.reject(new Error(message));
      }
      return Promise.reject(new Error(error.message));
    }


    const interceptor = instance.interceptors.response.use(resInterceptor, errInterceptor);

    return () => instance.interceptors.response.eject(interceptor);

  }, [t])
  return children;
}


export default instance;
export { AxiosInterceptor };
