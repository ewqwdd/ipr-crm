import { createRoot } from 'react-dom/client';
import './app/index.css';
import App from './app/App';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './app/store/store';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={import.meta.env.VITE_ROUTER_BASE_URL}>
    <Provider store={store}>
      <App />
      <Toaster position="top-right" />
    </Provider>
  </BrowserRouter>,
);
