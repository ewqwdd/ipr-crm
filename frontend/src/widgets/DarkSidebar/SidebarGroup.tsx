import { Disclosure } from '@headlessui/react';
import { NavType } from './config/types';
import { cva } from '@/shared/lib/cva';
import { NavLink } from 'react-router';
import { generalService } from '@/shared/lib/generalService';

const SidebarGroup = ({
  item,
  pathname,
}: {
  item: NavType;
  pathname: string;
}) => {
  return (
    <Disclosure as="div" className="space-y-1" key={item.name}>
      {() => (
        <>
          <Disclosure.Button
            className={cva(
              'text-gray-300 hover:bg-gray-700 hover:text-white',
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full',
            )}
          >
            {item.icon && (
              <item.icon
                className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                aria-hidden="true"
              />
            )}
            {item.name}
            {!!item.count && item.count}
          </Disclosure.Button>
          <Disclosure.Panel className="space-y-1">
            {item.children?.map((subItem: NavType) => (
              <Disclosure.Button
                key={subItem.name}
                as={NavLink}
                to={subItem.href!}
                className={cva(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md h-10',
                  {
                    'bg-gray-900 text-white [&_svg]:text-gray-300 [&_p]:bg-gray-800 [&_p]:hover:bg-gray-800':
                      generalService.checkActiveLink(subItem.href!, pathname),
                    'text-gray-400/90 hover:bg-gray-700 hover:text-gray-100':
                      !generalService.checkActiveLink(subItem.href!, pathname),
                  },
                )}
              >
                {subItem.name}
                {!!subItem.count && subItem.count}
              </Disclosure.Button>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default SidebarGroup;
