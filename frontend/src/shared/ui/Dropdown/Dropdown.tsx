import { ReactNode, useRef } from 'react';
import { Menu, Transition } from '@headlessui/react';
import PortalWithPosition from '@/shared/ui/Portal';
import { cva } from '@/shared/lib/cva';

interface DropdownProps {
  buttons?: { text: string; onClick?: () => void; icon?: ReactNode }[];
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
  ddBtnClassName?: string;
  button: ReactNode;
  btnClassName?: string;
}

export default function Dropdown({
  buttons = [],
  children,
  bodyClassName,
  className,
  button,
  ddBtnClassName,
  btnClassName,
}: DropdownProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const childrenRef = useRef<HTMLDivElement | null>(null);
  return (
    <Menu
      as="div"
      className={cva('relative inline-block text-left', className)}
    >
      <div>
        <Menu.Button
          ref={buttonRef}
          className={cva(
            'bg-gray-100 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500',
            btnClassName,
          )}
        >
          {button}
        </Menu.Button>
      </div>

      <Transition
        // as={Fragment}
        as="div"
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <PortalWithPosition targetRef={buttonRef} childrenRef={childrenRef}>
          <Menu.Items
            className={cva(
              'origin-top-right w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
              bodyClassName,
            )}
          >
            <div className="py-1" ref={childrenRef}>
              {buttons.map((button, index) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <button
                      onClick={button.onClick}
                      className={cva(
                        'block px-4 py-2 text-sm text-gray-700 w-full text-left',
                        {
                          'bg-gray-100 text-gray-900': active,
                        },
                        ddBtnClassName,
                      )}
                    >
                      <div className="flex items-center">
                        {button.icon}
                        <span className="ml-2">{button.text}</span>
                      </div>
                    </button>
                  )}
                </Menu.Item>
              ))}
              {children}
            </div>
          </Menu.Items>
        </PortalWithPosition>
      </Transition>
    </Menu>
  );
}
