import { useAppDispatch, useAppSelector } from '@/app';
import { Avatar } from '@/shared/ui/Avatar';
import { Disclosure } from '@headlessui/react';

import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { adminNavigation } from './config/adminNavigation';
import { userNavigation } from './config/userNavigation';
import { LogoutIcon } from '@heroicons/react/outline';
import { $api } from '@/shared/lib/$api';
import { userActions } from '@/entities/user';
import { NotificationBell } from '@/entities/notifications';
import { Badge } from '@/shared/ui/Badge';
import { generalService } from '@/shared/lib/generalService';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

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
              !item.href ? (
                <div
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  key={item.name}
                >
                  <span className="font-semibold text-gray-500 text-base">
                    {item.name}
                  </span>
                  {!!item.count && item.count > 0 && (
                    <Badge
                      className="rounded-full size-4 justify-center ml-4"
                      color="red"
                    >
                      {item.count}
                    </Badge>
                  )}
                </div>
              ) : (
                <div key={item.name}>
                  <NavLink
                    key={item.name}
                    to={item.href!}
                    end
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? 'bg-gray-900 text-white [&_svg]:text-gray-300 [&_p]:bg-gray-800 [&_p]:hover:bg-gray-800'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                      )
                    }
                  >
                    {item.icon && (
                      <item.icon
                        className={
                          'mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300'
                        }
                        aria-hidden="true"
                      />
                    )}
                    <span className="flex-1">{item.name}</span>
                    {!!item.count && item.count > 0 && (
                      <Badge
                        className="rounded-full size-4 justify-center ml-4"
                        color="red"
                      >
                        {item.count}
                      </Badge>
                    )}
                  </NavLink>
                </div>
              )
            ) : (
              <Disclosure as="div" key={item.name} className="space-y-1">
                {() => (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full',
                      )}
                    >
                      {item.icon && (
                        <item.icon
                          className={
                            'mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300'
                          }
                          aria-hidden="true"
                        />
                      )}
                      {item.name}
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-1">
                      {item.children?.map((subItem) => (
                        <Disclosure.Button
                          key={subItem.name}
                          as={NavLink}
                          to={subItem.href!}
                          className={classNames(
                            generalService.checkActiveLink(subItem.href!, pathname)
                              ? 'bg-gray-900 text-white [&_svg]:text-gray-300 [&_p]:bg-gray-800 [&_p]:hover:bg-gray-800'
                              : 'text-gray-400/90 hover:bg-gray-700 hover:text-gray-100',
                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md h-10',
                          )}
                        >
                          {subItem.name}
                          {!!subItem.count && subItem.count > 0 && (
                            <Badge
                              className="rounded-full size-4 justify-center ml-4"
                              color="red"
                            >
                              {subItem.count}
                            </Badge>
                          )}
                        </Disclosure.Button>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ),
          )}
        </nav>
      </div>
      <div className="flex-shrink-0 flex bg-gray-700 p-4">
        <Link to="/" className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <Avatar className="size-9" src={generalService.transformFileUrl(user?.avatar)} />
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
