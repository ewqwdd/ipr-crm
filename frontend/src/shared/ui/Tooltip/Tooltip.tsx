import { FC, Fragment, ReactNode, useState } from 'react';
import { Transition } from '@headlessui/react';

type Position = 'top' | 'bottom';
type Alignment = 'left' | 'center' | 'right';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: Position;
  align?: Alignment;
  className?: string;
  contentClassName?: string;
}

const getPositionClasses = (position: Position, align: Alignment) => {
  const baseClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
  };

  const alignClasses = {
    left: {
      top: 'left-[calc(0%-0.5rem)]',
      bottom: 'left-[calc(0%-0.5rem)]',
    },
    center: {
      top: 'left-1/2 -translate-x-1/2',
      bottom: 'left-1/2 -translate-x-1/2',
    },
    right: {
      top: 'right-[calc(0%-0.5rem)]',
      bottom: 'right-[calc(0%-0.5rem)]',
    },
  };

  return `${baseClasses[position]} ${alignClasses[align][position]}`;
};

const getArrowPosition = (position: Position, align: Alignment) => {
  const positions = {
    top: {
      left: 'left-[1rem]',
      center: 'left-1/2 -translate-x-1/2',
      right: 'right-[1rem]',
    },
    bottom: {
      left: 'left-[1rem]',
      center: 'left-1/2 -translate-x-1/2',
      right: 'right-[1rem]',
    },
  };

  return positions[position][align];
};

const getArrowClasses = (position: Position, align: Alignment) => {
  const baseClasses = {
    top: 'bottom-[-4px] -translate-x-1/2',
    bottom: 'top-[-4px] -translate-x-1/2',
  };

  return `absolute h-2 w-2 rotate-45 bg-gray-900 ${baseClasses[position]} ${getArrowPosition(position, align)}`;
};

const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  align = 'center',
  className,
  contentClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative inline-block ${className || ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}

      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div
          className={`absolute z-10 w-max max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg ${getPositionClasses(position, align)} ${contentClassName || ''}`}
        >
          {content}
          <div className={getArrowClasses(position, align)} />
        </div>
      </Transition>
    </div>
  );
};

export default Tooltip;
