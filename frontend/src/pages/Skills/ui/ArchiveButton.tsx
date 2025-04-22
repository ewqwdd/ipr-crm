import { useAppDispatch } from '@/app';
import { rate360Api } from '@/shared/api/rate360Api';
import { skillsApi } from '@/shared/api/skillsApi';
import { universalApi } from '@/shared/api/universalApi';
import { cva } from '@/shared/lib/cva';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ArchiveButton() {
  const [mutate, { isSuccess, isError, isLoading }] =
    skillsApi.useArchiveAllMutation();
  const versionApi = skillsApi.useGetVersionQuery();
  const dispatch = useAppDispatch();

  const onClick = () => {
    mutate();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Версия зафиксирована');
      console.log('Версия зафиксирована');
      dispatch(rate360Api.util.invalidateTags(['Rate360']));
      dispatch(universalApi.util.invalidateTags(['Spec']));
    }
  }, [isSuccess, dispatch]);

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
