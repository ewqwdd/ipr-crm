import { NavLink } from 'react-router';
import { NavType } from './config/types';
import { cva } from '@/shared/lib/cva';

const SidebarItem = ({ item }: { item: NavType }) => {
  if (!item.href) {
    return (
      <div
        className="flex items-center px-2 py-2 text-sm font-medium rounded-md"
        key={item.name}
      >
        <span className="font-semibold text-gray-500 text-base">
          {item.name}
        </span>
        {!!item.count && item.count}
      </div>
    );
  }

  return (
    <div key={item.name}>
      <NavLink
        to={item.href}
        end
        className={({ isActive }) =>
          cva(
            isActive
              ? 'bg-gray-900 text-white [&_svg]:text-gray-300 [&_p]:bg-gray-800 [&_p]:hover:bg-gray-800'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
          )
        }
      >
        {item.icon && (
          <item.icon
            className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300"
            aria-hidden="true"
          />
        )}
        <span className="flex-1">{item.name}</span>
        {!!item.count && item.count}
      </NavLink>
    </div>
  );
};

export default SidebarItem;
