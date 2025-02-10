import { Route, Routes } from 'react-router';
import { routerItems } from './config/routerItems';
import { RouterItemType } from './config/types';
import AdminWrapper from './AdminWrapper';
import { memo } from 'react';

export default memo(function AppRouter() {
  const renderRoute = (item: RouterItemType) => {
    const { element, path, children, onlyAdmin } = item;
    return (
      <Route
        key={path}
        path={path}
        element={onlyAdmin ? <AdminWrapper>{element}</AdminWrapper> : element}
        children={children?.map((child) => renderRoute(child))}
      />
    );
  };

  const content = routerItems.map((item) => renderRoute(item));

  return <Routes>{content}</Routes>;
});
