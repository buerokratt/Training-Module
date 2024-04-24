import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {QueryClient, QueryClientProvider, QueryFunction} from '@tanstack/react-query';

import apiInstance from 'services/api';
import App from './App';
import { ToastProvider } from 'context/ToastContext';
import 'styles/main.scss';
import '../i18n';
import auth from "./services/auth";
import apiDevV2 from "./services/api-dev-v2";
import apiTraining from "./services/training-api";
import apiGeneric from "./services/apigeneric";
import {mockedEndpoints} from "./services/mocked-endpoints";
import apiDev from "./services/api-dev";

const defaultQueryFn: QueryFunction | undefined = async ({ queryKey }) => {

  if (import.meta.env.REACT_APP_LOCAL === 'true' && queryKey.includes('prod')) {
    const { data } = await apiGeneric.get(queryKey[0] as string);
    return data?.response;
  }
  if (mockedEndpoints.some(endpoint => (queryKey[0] as string).startsWith(endpoint))) {
    const { data } = await apiGeneric.get(queryKey[0] as string);
    return data?.response;
  }
  if (queryKey.includes('user-profile-settings')) {
    const { data } = await apiTraining.get(queryKey[0] as string);
    return data;
  }
  if (queryKey.includes('prod')) {
    if (queryKey.includes('cs-get-all-active-chats')) {
      const { data } = await apiDev.get('sse/'+ (queryKey[0] as string), {
        headers: {
          "Accept": 'text/event-stream'
        }});
      return data;
    } else {
      const { data } = await apiDev.get(queryKey[0] as string);
      return data;
    }
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
  if(queryKey.includes('slots/slotById')) {
    const request = {
      "slot": queryKey[1],
    };
    const { data } = await apiInstance.post(queryKey[0] as string, request)
    return data;
  }
  if(queryKey.includes('forms/formById')) {
    const request = {
      "form": queryKey[1],
    };
    const { data } = await apiInstance.post(queryKey[0] as string, request)
    return data;
  }
  if (queryKey.includes('story-by-name')) {
    const request = {
      "story": queryKey[1]
    };
    const { data } = await apiInstance.post(queryKey[0] as string, request)
    return data.response;
  }
  if (queryKey.includes('rule-by-name')) {
    const request = {
      "rule": queryKey[1]
    };
    const { data } = await apiInstance.post(queryKey[0] as string, request)
    return data.response;
  }
  if(queryKey.includes('intents-report')) {
    const request = {
      id: queryKey[1],
    };
    const { data } = await apiInstance.post(queryKey[0] as string, request);
    return data.response;
  }

  const { data } = await apiInstance.get(queryKey[0] as string);
  if (
    queryKey.includes('entities')
    || queryKey.includes('services/unassigned')
    || queryKey.includes('services/connection-requests')
  ) {
    return data.response;
  }
  if (queryKey.includes('regexes')) {
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>,
);
