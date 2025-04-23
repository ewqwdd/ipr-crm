import { useAppDispatch, useAppSelector } from '@/app';
import { userActions } from '@/entities/user';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { $api } from '../lib/$api';
import { guestRoutes } from '@/app/router/config/routerItems';
import { rate360Api } from '../api/rate360Api';
import { testsApi } from '../api/testsApi';
import { surveyApi } from '../api/surveyApi';
import { iprApi } from '../api/iprApi';

export const useAuthControl = () => {
  const user = useAppSelector((state) => state.user.user);
  const isMounted = useAppSelector((state) => state.user.isMounted);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    $api
      .get('/auth/me')
      .then(({ data }) => {
        dispatch(userActions.setUser(data));
      })
      .catch(() => {
        dispatch(userActions.setMounted(true));
      });
  }, [dispatch]);

  useEffect(() => {
    if (
      isMounted &&
      !user &&
      !guestRoutes.find((e) => window.location.pathname.includes(e))
    ) {
      navigate('/login');
      dispatch(rate360Api.util.resetApiState());
      dispatch(testsApi.util.resetApiState());
      dispatch(surveyApi.util.resetApiState());
      dispatch(iprApi.util.resetApiState());
    }
  }, [isMounted, user, navigate, dispatch]);

  return { user, isMounted };
};
