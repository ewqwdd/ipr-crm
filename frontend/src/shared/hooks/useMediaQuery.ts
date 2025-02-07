import { useLayoutEffect, useState } from 'react';

export const useMinMediaQuery = (query: number) => {
  const [state, setState] = useState<boolean>(false);

  useLayoutEffect(() => {
    const check = () => {
      if (query <= window.innerWidth) {
        setState(true);
      } else {
        setState(false);
      }
    };
    window.addEventListener('resize', check);
    check();
    return () => {
      window.removeEventListener('resize', check);
    };
  }, [query]);

  return state;
};

export const useMaxMediaQuery = (query: number) => {
  const [state, setState] = useState<boolean>(false);

  useLayoutEffect(() => {
    const check = () => {
      if (query > window.innerWidth) {
        setState(true);
      } else {
        setState(false);
      }
    };
    window.addEventListener('resize', check);
    check();

    return () => {
      window.removeEventListener('resize', check);
    };
  }, [query]);

  return state;
};
