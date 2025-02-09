import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { openModal as open, closeModal as close } from '@/app/store/modalSlice';

export const useModal = () => {
  const dispatch = useDispatch();

  const openModal = useCallback(
    (type: string, data?: unknown) => {
      dispatch(open({ type, data }));
    },
    [dispatch],
  );

  const closeModal = useCallback(() => {
    dispatch(close());
  }, [dispatch]);

  return { openModal, closeModal };
};
