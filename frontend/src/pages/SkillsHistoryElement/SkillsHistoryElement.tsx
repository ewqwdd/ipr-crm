import { useAppDispatch } from '@/app';
import { useModal } from '@/app/hooks/useModal';
import { skillsApi } from '@/shared/api/skillsApi';
import { useInvalidateTags } from '@/shared/hooks/useInvalidateTags';
import { dateService } from '@/shared/lib/dateService';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { CompetencyList } from '@/widgets/CompetencyList';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

export default function SkillsHistoryElement() {
  const { id } = useParams<{ id: string }>();
  const { data, isFetching } = skillsApi.useGetVersionByIdQuery(Number(id));
  const [mutate, { isError, isSuccess }] =
    skillsApi.useRestoreArchiveMutation();
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const invalidateTags = useInvalidateTags();

  const onRestoreVersion = () => {
    openModal('CONFIRM', {
      submitText: 'Подтвердить',
      title: 'Востановить версию?',
      onSubmit: async () => {
        return await mutate({ id: Number(id) });
      },
    });
  };

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка при востановлении версии профиля');
    }
    if (isSuccess) {
      toast.success('Версия профиля востановлена');
      invalidateTags(['Spec']);
      invalidateTags(['ProductFolders', 'TeamFolders', 'SpecFolders']);
      navigate('/skills/history');
    }
  }, [isError, isSuccess, dispatch, navigate]);

  return (
    <LoadingOverlay active={isFetching}>
      <div className={'px-8 py-10 flex flex-col'}>
        <div className="flex justify-between items-start mb-6">
          <Heading
            title="Версия профиля"
            description={dateService.formatDateTime(data?.date)}
          />
          <PrimaryButton onClick={onRestoreVersion}>
            Востановить версию
          </PrimaryButton>
        </div>
        <CompetencyList disabled data={data?.blocks} loading={isFetching} />
      </div>
    </LoadingOverlay>
  );
}
