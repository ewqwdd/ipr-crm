import { useModal } from '@/app/hooks/useModal';
import { skillsApi } from '@/shared/api/skillsApi';
import Dimmer from '@/shared/ui/Dimmer';
import { CompetencyList } from '@/widgets/CompetencyList';
import { useParams } from 'react-router';

export default function SkillsHistoryElement() {
  const { id } = useParams<{ id: string }>();
  const { data, isFetching } = skillsApi.useGetVersionByIdQuery(Number(id));
  const { openModal } = useModal();

  return (
    <Dimmer active={isFetching}>
      <div className={'px-8 py-10 flex flex-col'}>
        <CompetencyList
          disabled
          data={data?.blocks}
          openModal={openModal}
          loading={isFetching}
        />
      </div>
    </Dimmer>
  );
}
