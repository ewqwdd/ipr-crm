import { useAppSelector } from '@/app';
import { useModal } from '@/app/hooks/useModal';
import { Rate } from '@/entities/rates';
import { rate360Api } from '@/shared/api/rate360Api';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { BellIcon, TrashIcon } from '@heroicons/react/outline';
import { memo } from 'react';

interface SettingsProps {
  selected: number[];
  setSelected: (selected: number[]) => void;
  data?: Rate[];
}

export default memo(function Settings({
  selected,
  setSelected,
  data,
}: SettingsProps) {
  const { openModal } = useModal();
  const [removeRates, removeRatesProps] = rate360Api.useDeleteRatesMutation();
  const role = useAppSelector((state) => state.user.user?.role.name);

  if (selected.length === 0) return null;

  const foundRates = data?.filter((rate) => selected.includes(rate.id));
  const isFinished = foundRates?.some((rate) => rate.finished);

  const onDelete = () => {
    openModal('CONFIRM', {
      submitText: 'Удалить',
      title: 'Удалить выбранные Оценки?',
      onSubmit: async () => removeRates({ ids: selected }),
    });
  };

  return (
    <div
      className={cva(
        'flex gap-3 p-3 pb-5 absolute bottom-0 right-0 w-full bg-white shadow-2xl items-center',
        {
          'animate-pulse pointer-events-none': removeRatesProps.isLoading,
        },
      )}
    >
      <span className="font-medium text-gray-800">
        Выбран {selected.length} тест
      </span>

      <button
        className="text-indigo-500 hover:text-indigo-700"
        onClick={() => setSelected([])}
      >
        Сбросить
      </button>

      {!isFinished && (
        <SoftButton className="ml-auto">
          <BellIcon className="h-5 w-5" />
          <span>Напомнить</span>
        </SoftButton>
      )}
      {role === 'admin' && (
        <SoftButton
          className={cva({ 'ml-auto': !!isFinished })}
          onClick={onDelete}
        >
          <TrashIcon className="h-5 w-5 text-red-500" />
          <span>Удалить</span>
        </SoftButton>
      )}
    </div>
  );
});
