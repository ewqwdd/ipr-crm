import { skillsApi } from '@/shared/api/skillsApi';
import { cva } from '@/shared/lib/cva';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface ArchiveButtonProps {
  archiveMutation: ReturnType<typeof skillsApi.useArchiveAllMutation>;
}

export default function ArchiveButton({archiveMutation}: ArchiveButtonProps) {
  const [mutate, { isError, isLoading }] =
    archiveMutation;
  const versionApi = skillsApi.useGetVersionQuery();
  const onClick = () => {
    mutate();
  };


  useEffect(() => {
    if (isError) {
      toast.error('Ошибка при фиксации версии');
    }
  }, [isError]);

  const dateStr = versionApi.data?.date
    ? versionApi.data?.date.toISOString().slice(0, 10)
    : isLoading
      ? ''
      : 'нет данных';

  return (
    <div
      className={cva('self-end mt-2 flex gap-2 items-center', {
        'animate-pulse pointer-events-none': versionApi.isLoading,
      })}
    >
      <div className="text-sm text-gray-800 my-2">
        <span className="text-gray-800">Текущая версия: </span>
        <span className="text-gray-600">{dateStr}</span>
      </div>
      <PrimaryButton
        onClick={onClick}
        className={cva({ 'animate-pulse pointer-events-none': isLoading })}
      >
        Зафиксировать <span className="max-sm:hidden ml-1">версию</span>
      </PrimaryButton>
    </div>
  );
}
