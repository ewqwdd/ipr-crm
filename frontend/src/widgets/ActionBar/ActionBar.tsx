import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { ReactElement, ReactNode } from 'react';

interface SoftButtonProps<T> {
  className?: string;
  onClick?: (selected: T[]) => void;
  label?: ReactNode;
  icon?: ReactElement;
  danger?: boolean;
  success?: boolean;
  hide?: boolean;
}

interface ActionBarProps<T> {
  loading?: boolean;
  selected?: T[];
  clearSelected?: () => void;
  buttonsConfig?: SoftButtonProps<T>[];
}

export default function ActionBar<T>({
  loading,
  selected,
  clearSelected,
  buttonsConfig,
}: ActionBarProps<T>) {
  const firstIndex = buttonsConfig?.findIndex((b) => !b.hide) ?? -1;

  return (
    <div
      className={cva(
        'flex gap-3 p-3 pb-5 fixed bottom-0 right-0 w-full bg-white shadow-2xl items-center flex-wrap',
        {
          'animate-pulse pointer-events-none': !!loading,
        },
      )}
    >
      {selected && (
        <p className="font-medium text-gray-800 max-sm:text-sm text-nowrap">
          <span className="max-sm:hidden">Выбрано</span> {selected.length}
        </p>
      )}

      {selected && clearSelected && (
        <button
          className="text-indigo-500 hover:text-indigo-700 max-sm:text-sm"
          onClick={clearSelected}
        >
          Сбросить
        </button>
      )}

      {buttonsConfig?.map((button, index) => {
        if (button.hide) return null;
        return (
          <SoftButton
            key={index}
            className={cva('max-sm:p-2 [&>svg]:size-5', button.className, {
              'ml-auto': index === firstIndex,
            })}
            onClick={() => button.onClick?.(selected ?? [])}
            danger={button.danger}
            success={button.success}
          >
            {button.icon}
            <p className={cva({ 'max-sm:hidden': !!button.icon })}>
              {button.label}
            </p>
          </SoftButton>
        );
      })}
    </div>
  );
}
