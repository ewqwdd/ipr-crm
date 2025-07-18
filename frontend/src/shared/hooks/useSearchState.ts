import { SetStateAction, useEffect, useLayoutEffect, useState } from 'react';
import { objectRegex } from '../lib/regex';
import { DateObject } from 'react-multi-date-picker';

type CombinedType = Date | string | number | object | undefined | unknown[];

const transformFromSearch = (value: string | null): CombinedType => {
  if (!value) return;
  if (objectRegex.test(value)) {
    try {
      return JSON.parse(value);
    } catch {
      // Не валидный JSON, вернуть как есть
      return value;
    }
  } else if (/^-?\d+$/.test(value)) {
    return Number(value);
  } else if (!isNaN(new Date(value).getTime())) {
    return new DateObject(value);
  } else if (value.includes(',')) {
    const splitted = value.split(',');
    return splitted.map(transformFromSearch);
  } else {
    return value;
  }
};

const transformToSearch = (
  value: Date | string | number | object | unknown | unknown[],
): string => {
  if (value instanceof Date) {
    return value.toISOString();
  } else if (Array.isArray(value)) {
    return value.join(',');
  } else if (typeof value === 'object') {
    return JSON.stringify(value);
  } else {
    return String(value);
  }
};

export const useSearchState = <T extends object>(
  initialState: T,
): [T, React.Dispatch<SetStateAction<T>>, boolean] => {
  const [state, setState] = useState<T>(initialState);
  const [inited, setInited] = useState(false);

  useLayoutEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const newState = {} as T;
    searchParams.forEach((value, key) => {
      if (!value) return;
      // @ts-ignore
      newState[key as keyof T] = transformFromSearch(value);
    });

    setState((prev) => ({
      ...prev,
      ...newState,
    }));
  }, []);

  useEffect(() => {
    return () => setInited(true);
  }, [state]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    Object.keys(state).forEach((key) => {
      const value = state[key as keyof T];
      if (!value) return;
      newSearchParams.set(key, transformToSearch(value));
    });
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;

    window.history.replaceState({}, '', newUrl);
  }, [state]);

  return [state, setState, inited];
};
