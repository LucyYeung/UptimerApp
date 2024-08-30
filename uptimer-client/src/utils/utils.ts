import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export interface IFrequency {
  value: number;
  name: string;
}

export const FREQUENCIES: IFrequency[] = [
  {
    name: '10 sec',
    value: 10,
  },
  {
    name: '30 sec',
    value: 30,
  },
  {
    name: '1 min',
    value: 60,
  },
  {
    name: '5 mins',
    value: 300,
  },
  {
    name: '15 mins',
    value: 900,
  },
  {
    name: '30 mins',
    value: 1800,
  },
  {
    name: '1 hour',
    value: 3600,
  },
  {
    name: '24 hours',
    value: 86400,
  },
];

export const SSL_FREQUENCIES: IFrequency[] = [
  {
    name: '30 sec',
    value: 30,
  },
  {
    name: '24 hours',
    value: 86400,
  },
  {
    name: '5 days',
    value: 432000,
  },
  {
    name: '7 days',
    value: 604800,
  },
  {
    name: '15 days',
    value: 1.296e6,
  },
  {
    name: '30 days',
    value: 2.592e6,
  },
];

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
export const EXCLUDED_HTTP_METHODS = ['POST', 'PUT', 'PATCH'];

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

export const timeFromNow = (date: string) => {
  if (date === 'null') {
    return 'None';
  }
  return dayjs(new Date(JSON.parse(date))).fromNow();
};
