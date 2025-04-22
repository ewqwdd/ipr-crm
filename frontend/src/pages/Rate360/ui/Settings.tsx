import { useAppSelector } from '@/app';
import { useModal } from '@/app/hooks/useModal';
import { Rate } from '@/entities/rates';
import { rate360Api } from '@/shared/api/rate360Api';
import { $api } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import {
  BellIcon,
  DocumentAddIcon,
  DocumentRemoveIcon,
  TrashIcon,
} from '@heroicons/react/outline';
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
  const [toggleReportVisibility, toggleReportVisibilityState] =
    rate360Api.useToggleReportVisibilityMutation();
  const role = useAppSelector((state) => state.user.user?.role.name);

  if (selected.length === 0) return null;

  const foundRates = data?.filter((rate) => selected.includes(rate.id));
  const isFinished = foundRates?.some((rate) => rate.finished);

  const onDelete = () => {
    openModal('CONFIRM', {
      submitText: 'Удалить',
      title: 'Удалить выбранные Оценки?',
      onSubmit: async () => {
        setSelected([]);
        return await removeRates({ ids: selected });
      },
    });
  };

  const onReportVisibilityChange = (visible: boolean) => {
    const word = visible ? 'Показать' : 'Скрыть';
    openModal('CONFIRM', {
      submitText: word,
      title: `${word} выбранные Отчеты?`,
      onSubmit: async () => {
        setSelected([]);
        return await toggleReportVisibility({ ids: selected, visible });
      },
    });
  };

  const notifyRates = () => {
    openModal('CONFIRM', {
      submitText: 'Напомнить',
      title: `Напомнить о завершении оценки ${selected?.length} оценкам?`,
      onSubmit: async () => {
        setSelected([]);
        return await $api.post('/rate360/notify', { ids: selected });
      },
    });
  };

  return (
    <div
      className={cva(
        'flex gap-3 p-3 pb-5 fixed bottom-0 right-0 w-full bg-white shadow-2xl items-center',
        {
          'animate-pulse pointer-events-none':
            removeRatesProps.isLoading || toggleReportVisibilityState.isLoading,
        },
      )}
    >
      <span className="font-medium text-gray-800 max-sm:text-sm text-nowrap">
        Выбрано {selected.length}
      </span>

      <button
        className="text-indigo-500 hover:text-indigo-700 max-sm:text-sm"
        onClick={() => setSelected([])}
      >
        Сбросить
      </button>

      <SoftButton
        className="ml-auto max-sm:p-2"
        success
        onClick={() => onReportVisibilityChange(true)}
      >
        <DocumentAddIcon className="h-5 w-5" />
        <span className="max-sm:hidden">Показать отчет сотруднику</span>
      </SoftButton>

      <SoftButton
        className="max-sm:p-2"
        danger
        onClick={() => onReportVisibilityChange(false)}
      >
        <DocumentRemoveIcon className="h-5 w-5" />
        <span className="max-sm:hidden">Скрыть отчет</span>
      </SoftButton>

      {!isFinished && (
        <SoftButton className="max-sm:p-2" onClick={notifyRates}>
          <BellIcon className="h-5 w-5" />
          <span className="max-sm:hidden">Напомнить</span>
        </SoftButton>
      )}
      {role === 'admin' && (
        <SoftButton className={'max-sm:p-2'} onClick={onDelete} danger>
          <TrashIcon className="h-5 w-5 text-red-500" />
          <span className="max-sm:hidden">Удалить</span>
        </SoftButton>
      )}
    </div>
  );
});
