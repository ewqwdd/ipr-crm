import { Route, Routes } from 'react-router';
import { routerItems } from './config/routerItems';
import AdminWrapper from './AdminWrapper';
import { memo, Suspense } from 'react';
import { SuspenseLoader } from '@/widgets/SuspenseLoader';

export default memo(function AppRouter() {
  const content = routerItems.map(({ element, path, curator, onlyAdmin }) => (
    <Route
      key={path}
      path={path}
      element={
        <Suspense fallback={<SuspenseLoader />}>
          {onlyAdmin ? (
            <AdminWrapper curator={curator}>{element}</AdminWrapper>
          ) : (
            element
          )}
        </Suspense>
      }
    />
  ));

  return <Routes>{content}</Routes>;
});
