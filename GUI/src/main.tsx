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
import auth from "./services/auth";
import apiDevV2 from "./services/api-dev-v2";
import apiTraining from "./services/training-api";
import apiDev from "./services/api-dev";

const defaultQueryFn: QueryFunction | undefined = async ({ queryKey }) => {
  let apiInstance;


  // Temporary solution to let some API requests use Ruuter instead of MSW
  // Add keywords to the array to make the request go into Ruuter's endpoint
  const keywords = ['intent', 'entities', 'in-model', 'responses','regex','regexes','stories','rules'];

  // @ts-ignore
  if(keywords.some(keyword => queryKey[0].startsWith(keyword))) {
    apiInstance = apiRuuter;
  } else {
    apiInstance = api;
  }
  if(import.meta.env.REACT_APP_LOCAL !== true) {
    if (queryKey.includes('prod')) {
      const { data } = await apiDev.get(queryKey[0] as string);
      return data;
    }
    if (queryKey.includes('user-profile-settings')) {
      const { data } = await apiTraining.get(queryKey[0] as string);
      return data;
    }
    if (queryKey[1] === 'prod-2') {
      const { data } = await apiDevV2.get(queryKey[0] as string);
      return data?.response;
    }
    if(queryKey[1] === 'auth') {
      const { data } = await auth.get(queryKey[0] as string);
      return data;
    }
    if(queryKey.includes('regex') && queryKey.includes('examples')) {
      const request = {
        "regex": queryKey[1],
        "examples": true
      };
      const { data } = await apiInstance.post(queryKey[0] as string, request)
      return data.response;
    }
  }

  const { data } = await apiInstance.get(queryKey[0] as string);
  if(queryKey.includes('entities')) {
    return data.response;
  }
  if(queryKey.includes('regexes')) {
    return data.response.data.regexes;
  }
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
      //This code snippet will allow to remove MSW warning messages for specific URLS
      onUnhandledRequest(req, print) {
        // specify routes to exclude
        const excludedRoutes = ['rasa'];

        // check if the req.url.pathname contains excludedRoutes
        const isExcluded = excludedRoutes.some(route => req.url.pathname.includes(route))
        if(isExcluded) {
          return;
        }
        },
      serviceWorker: {
        url: '/training/mockServiceWorker.js'
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
