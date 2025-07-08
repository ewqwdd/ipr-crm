import axios from 'axios';
import toast from 'react-hot-toast';

export const $api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL as string,
});

export const $fileApi = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_FILES_URL as string,
});

export const $uploadFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await $fileApi.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.filename;
  } catch (error) {
    console.error('File upload failed:', error);
    toast.error('Ошибка загрузки файла. Пожалуйста, попробуйте еще раз.');
    throw new Error('Failed to upload file');
  }
};
