import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { setupWorker } from 'msw';
import { QueryClient, QueryClientProvider, QueryFunction } from '@tanstack/react-query';

import api from 'services/api';
import apiRuuter from 'services/temp-api';

import App from './App';
import { ToastProvider } from 'context/ToastContext';
import { handlers } from 'mocks/handlers';
import 'styles/main.scss';
import '../i18n';

const defaultQueryFn: QueryFunction | undefined = async ({ queryKey }) => {
  let apiInstance;

  // @ts-ignore
  if (queryKey[0].startsWith('intent') ||
      queryKey[0].startsWith('entities') ||
      queryKey[0].startsWith('in-model')) {
    apiInstance = apiRuuter;
  } else {
    apiInstance = api;
  }

  const { data } = await apiInstance.get(queryKey[0] as string);
  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

if (import.meta.env.REACT_APP_MODE === 'development-api') {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ToastProvider>
              <App/>
            </ToastProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </React.StrictMode>,
  );
} else {
  const worker = setupWorker(...handlers);
  const prepare = async () => {
    return worker.start({
      serviceWorker: {
        url: 'mockServiceWorker.js'
      }
    });
  };

  prepare().then(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            {/* <BrowserRouter basename="/burokratt"> */}
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <ToastProvider>
                <App />
              </ToastProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </React.StrictMode>,
    );
  });
}
