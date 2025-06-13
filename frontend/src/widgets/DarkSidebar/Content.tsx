import { useAppDispatch, useAppSelector } from '@/app';
import { Avatar } from '@/shared/ui/Avatar';
import { Link, useLocation, useNavigate } from 'react-router';
import { adminNavigation } from './config/adminNavigation';
import { userNavigation } from './config/userNavigation';
import { LogoutIcon } from '@heroicons/react/outline';
import { $api } from '@/shared/lib/$api';
import { userActions } from '@/entities/user';
import { NotificationBell } from '@/entities/notifications';
import { generalService } from '@/shared/lib/generalService';
import SidebarItem from './SidebarItem';
import SidebarGroup from './SidebarGroup';

export default function Content() {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navigation =
    user?.role.name === 'admin' ? adminNavigation(user) : userNavigation(user);

  const logout = () => {
    $api.post('/auth/sign-out').then(() => {
      navigate('/login');
      dispatch(userActions.setUser(null));
    });
  };

  return (
    <>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 justify-between">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Workflow"
          />
          <NotificationBell />
        </div>
        <nav
          className="mt-5 flex-1 px-2 bg-gray-800 space-y-1"
          aria-label="Sidebar"
        >
          {navigation.map((item) =>
            !item.children ? (
              <SidebarItem key={item.name} item={item} />
            ) : (
              <SidebarGroup key={item.name} item={item} pathname={pathname} />
            ),
          )}
        </nav>
      </div>
      <div className="flex-shrink-0 flex bg-gray-700 p-4">
        <Link to="/" className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <Avatar
              className="size-9"
              src={generalService.transformFileUrl(user?.avatar)}
            />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                Профиль
              </p>
            </div>
            <button onClick={logout}>
              <LogoutIcon className="size-6 text-gray-100" />
            </button>
          </div>
        </Link>
      </div>
    </>
  );
}
