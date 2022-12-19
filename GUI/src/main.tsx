import React from 'react';
import ReactDOM from 'react-dom/client';
import { setupWorker } from 'msw';

import App from './App';
import { handlers } from 'mocks/handlers';
import 'styles/main.scss';
import '../i18n';

const worker = setupWorker(...handlers);

const prepare = async () => {
  if (import.meta.env.DEV) {
    return worker.start();
  }
};

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
