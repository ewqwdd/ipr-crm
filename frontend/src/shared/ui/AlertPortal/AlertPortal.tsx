import { Transition } from "@headlessui/react";
import React, { useState, useEffect, useRef, Fragment } from "react";
import ReactDOM from "react-dom";

interface AlertPortalProps {
    children: React.ReactNode;
    autoClose?: boolean;
    autoCloseDelay?: number;
    initial?: boolean;
}

const AlertPortal = ({ children, autoClose = false, autoCloseDelay = 3000, initial = false }: AlertPortalProps) => {
  const [open, setOpen] = useState(false);
  const el = useRef(document.createElement("div"));

  useEffect(() => {
    const current = el.current;
    document.body.appendChild(current);
    return () => {
      document.body.removeChild(current);
    };
  }, []);

  useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [open, autoClose, autoCloseDelay]);

  useEffect(() => {
    if (initial) {
      setTimeout(() => setOpen(true), 0);
    }
  }, [initial]);

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  const portal = ReactDOM.createPortal(
    <Transition
      show={open}
      as={Fragment}
      enter="transform transition ease-out duration-300"
      enterFrom="opacity-0 -translate-y-4 scale-95"
      enterTo="opacity-100 translate-y-0 scale-100"
      leave="transform transition ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0 scale-100"
      leaveTo="opacity-0 -translate-y-4 scale-95"
    >
      <div className="fixed inset-0 flex items-start justify-center z-50 pointer-events-none">
        <div className="mt-8 w-full max-w-md pointer-events-auto">
          <div className="bg-white shadow-lg rounded-lg p-4 flex items-start gap-3 border border-gray-200 relative">
            <div className="flex-1 text-gray-900">{children}</div>
            <button
              onClick={hide}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors absolute top-2 right-2"
              aria-label="Закрыть"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                <path
                  d="M6 6l8 8M6 14L14 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>,
    el.current
  );

  return { portal, show, hide, isOpen: open };
};

export default AlertPortal;