import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';

export enum Methods {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  patch = 'PATCH',
  delete = 'DELETE',
}

const env =
  import.meta.env.NODE_ENV === 'development'
    ? { DEBUG_ENABLED: true }
    : { DEBUG_ENABLED: false };
const baseURL = import.meta.env.REACT_APP_BUEROKRATT_API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use(
  (axiosResponse) => {
    env.DEBUG_ENABLED; // && console.log(axiosResponse);
    return axiosResponse;
  },
  (error: AxiosError) => {
    env.DEBUG_ENABLED; // && console.log(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (axiosRequest) => {
    env.DEBUG_ENABLED; // && console.log(axiosRequest);
    return axiosRequest;
  },
  (error: AxiosError) => {
    env.DEBUG_ENABLED && console.log(error);
    if (error.response?.status === 401) {
      //TODO: handle unauthorized requests
    }
    if (error.response?.status === 403) {
      //TODO: handle unauthorized requests
    }
    return Promise.reject(error);
  }
);

export const request = async <RequestDataType, ResponseType>({
  url,
  method = Methods.get,
  data,
  withCredentials = false,
  headers,
  responseType = 'json',
}: {
  url: string;
  method?: Methods;
  data?: RequestDataType;
  withCredentials?: boolean;
  headers?: AxiosRequestHeaders;
  responseType?:
    | 'json'
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'text'
    | 'stream';
}): Promise<ResponseType> => {
  const requestConfig: AxiosRequestConfig = {
    method: method || Methods.get,
    url,
  };

  if (data && method === Methods.get) {
    requestConfig.params = data;
  }

  if (data && method !== Methods.get) {
    requestConfig.data = data;
  }

  if (headers) {
    requestConfig.headers = headers;
  }

  if (withCredentials) {
    requestConfig.withCredentials = true;
  }

  if (responseType) {
    requestConfig.responseType = responseType;
  }

  const response = await axiosInstance(requestConfig);
  return response.data ?? response;
};
