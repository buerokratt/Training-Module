import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { setupWorker } from 'msw';
import { QueryClient, QueryClientProvider, QueryFunction } from '@tanstack/react-query';

import App from './App';
import api from 'services/api';
import { ToastProvider } from 'context/ToastContext';
import { handlers } from 'mocks/handlers';
import 'styles/main.scss';
import '../i18n';

const defaultQueryFn: QueryFunction | undefined = async ({ queryKey }) => {
  const { data } = await api.get(queryKey[0] as string);
  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

const worker = setupWorker(...handlers);

const prepare = async () => {
  return worker.start({
    serviceWorker: {
      url: 'mockServiceWorker.js'
    }
  });

/*   if (import.meta.env.MODE === 'development') {
    // return worker.start();
    return worker.start({
      serviceWorker: {
        url: 'burokratt/mockServiceWorker.js'
      }
    });
  }
  return Promise.resolve(); */
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
