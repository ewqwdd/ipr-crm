import { cva } from '@/shared/lib/cva';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { Fragment, ReactNode } from 'react';

interface DrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  dark?: boolean;
}

export default function Drawer({
  open,
  setOpen,
  title,
  children,
  dark,
}: DrawerProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-30"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-md">
                <div
                  className={cva(
                    'flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl',
                    {
                      'bg-gray-800 text-white': !!dark,
                    },
                  )}
                >
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      {title && (
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {' '}
                          {title}{' '}
                        </Dialog.Title>
                      )}
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className={cva(
                            'rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                            {
                              'bg-gray-600 text-gray-300': !!dark,
                            },
                          )}
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6 flex flex-col overflow-hidden">
                    {children}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
