import axios from 'axios';

export const $api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL as string,
});
