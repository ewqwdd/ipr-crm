import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  showLoading as setShowLoading,
  hideLoading as setHideLoading,
} from '../store/loadingSlice';

export const useLoading = () => {
  const dispatch = useDispatch();
  //
  const showLoading = useCallback(() => {
    dispatch(setShowLoading());
  }, [dispatch]);
  //
  const hideLoading = useCallback(() => {
    dispatch(setHideLoading());
  }, [dispatch]);
  return { showLoading, hideLoading };
};
