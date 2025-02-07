import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/index.css';
import App from './app/App';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './app/store/store';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster position="top-right" />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
