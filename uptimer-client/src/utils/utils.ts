import { toast } from 'react-toastify';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'colored',
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'colored',
  });
};

export const setLocalStorageItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

export const getLocalStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) as string);
  }
};

export const convertFrequency = (frequency: number): string => {
  const hour = frequency / (60 * 60);
  const minute = frequency / 60;
  if (hour >= 1) {
    return `${hour} hours`;
  }
  if (minute >= 1 && minute < 60) {
    return `${minute} mins`;
  }
  return `${frequency}s`;
};
