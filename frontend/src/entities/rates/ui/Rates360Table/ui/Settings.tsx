import { useAppSelector } from '@/app';
import { useModal } from '@/app/hooks/useModal';
import { Rate } from '@/entities/rates';
import { rate360Api } from '@/shared/api/rate360Api';
import { $api } from '@/shared/lib/$api';
import { ActionBar } from '@/widgets/ActionBar';
import {
  ArchiveIcon,
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
  const [archiveRates, archiveRatesProps] =
    rate360Api.useArchiveRatesMutation();

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

  const onArchive = () => {
    openModal('CONFIRM', {
      submitText: 'Архивировать',
      title: 'Архивировать выбранные Оценки?',
      onSubmit: async () => {
        setSelected([]);
        return await archiveRates({ ids: selected });
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
      title: 'Напомнить о прохождении  оценки',
      onSubmit: async () => {
        setSelected([]);
        return await $api.post('/rate360/notify', { ids: selected });
      },
    });
  };

  const isAllFinished = selected?.every(
    (rate) => data?.find((r) => r.id === rate)?.finished,
  );

  return (
    <ActionBar
      selected={selected}
      clearSelected={() => setSelected([])}
      loading={
        removeRatesProps.isLoading ||
        toggleReportVisibilityState.isLoading ||
        archiveRatesProps.isLoading
      }
      buttonsConfig={[
        {
          label: 'Архивировать',
          icon: <ArchiveIcon />,
          onClick: onArchive,
          hide: !isAllFinished,
        },
        {
          label: 'Показать отчет сотрудник',
          icon: <DocumentAddIcon />,
          onClick: () => onReportVisibilityChange(true),
          success: true,
        },
        {
          label: 'Скрыть отчет',
          icon: <DocumentRemoveIcon />,
          onClick: () => onReportVisibilityChange(false),
          danger: true,
        },
        {
          label: 'Напомнить',
          icon: <BellIcon />,
          onClick: notifyRates,
          hide: isFinished,
        },
        {
          label: 'Удалить',
          icon: <TrashIcon className="text-red-500" />,
          onClick: onDelete,
          danger: true,
          hide: role !== 'admin',
        },
      ]}
    />
  );
});
