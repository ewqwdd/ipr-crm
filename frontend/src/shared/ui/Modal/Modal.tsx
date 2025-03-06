/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon } from '@heroicons/react/outline';
import { cva } from '@/shared/lib/cva';

type Variant = 'success' | 'error' | 'warning' | 'info';

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit?: () => void;
  footer?: boolean;
  icon?: boolean;
  title?: string;
  children?: React.ReactNode;
  variant?: Variant;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  className?: string;
  childrenFlex?: boolean;
}

export default function Modal({
  open,
  setOpen,
  onSubmit,
  footer = true,
  icon,
  title,
  children,
  variant = 'info',
  cancelText = 'Отмена',
  submitText = 'Подтвердить',
  loading,
  className,
  childrenFlex = true,
}: ModalProps) {
  const btnColors: Record<Variant, string> = {
    error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    info: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
  };

  const textColors: Record<Variant, string> = {
    error: 'text-red-600',
    warning: 'text-yellow-400',
    success: 'text-green-600',
    info: 'text-indigo-600',
  };
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={cva(
                'relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full',
                {
                  'animate-pulse pointer-events-none': !!loading,
                },
                className,
              )}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg ">
                <div className={childrenFlex ? 'sm:flex sm:items-start' : ''}>
                  {icon && (
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationIcon
                        className={cva('h-6 w-6', textColors[variant])}
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div
                    className={cva(
                      'mt-3 text-center sm:mt-0 sm:text-left flex-1',
                      {
                        'sm:ml-4': !!icon,
                      },
                    )}
                  >
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {children}
                  </div>
                </div>
              </div>
              {footer && (
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className={cva(
                      'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
                      btnColors[variant],
                    )}
                    onClick={onSubmit}
                  >
                    {submitText}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    {cancelText}
                  </button>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
