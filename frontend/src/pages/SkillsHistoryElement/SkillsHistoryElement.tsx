import { useLoading } from '@/app/hooks/useLoading';
import { useModal } from '@/app/hooks/useModal';
import { skillsApi } from '@/shared/api/skillsApi';
import { CompetencyList } from '@/widgets/CompetencyList';
import { useEffect } from 'react';
import { useParams } from 'react-router';

export default function SkillsHistoryElement() {
  const { id } = useParams<{ id: string }>();
  const { data, isFetching } = skillsApi.useGetVersionByIdQuery(Number(id));
  const { openModal } = useModal();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isFetching) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isFetching, showLoading, hideLoading]);

  return (
    <div className={'px-8 py-10 flex flex-col'}>
      <CompetencyList
        disabled
        data={data?.blocks}
        openModal={openModal}
        loading={isFetching}
      />
    </div>
  );
}
