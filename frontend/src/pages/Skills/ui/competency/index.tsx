import { FC, useEffect, useMemo, useState } from 'react';
import { SoftButton } from '@/shared/ui/SoftButton';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { skillsApi } from '@/shared/api/skillsApi';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { CompetencyBlock, SkillsSwitcher } from '@/entities/skill';
import { useModal } from '@/app/hooks/useModal';
import ArchiveButton from '../ArchiveButton';
import { CompetencyList } from '@/widgets/CompetencyList';
import { useLoading } from '@/app/hooks/useLoading';

const Competency: FC = () => {
  const [skillsFilter, setSkillsFilter] = useState<'HARD' | 'SOFT'>('HARD');
  const [search, setSearch] = useState('');

  const { data, isFetching } = skillsApi.useGetSkillsQuery();
  const { openModal } = useModal();

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isFetching) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isFetching, showLoading, hideLoading]);

  const searchFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filtereedData = useMemo((): CompetencyBlock[] | undefined => {
    const filteredData = data
      ?.map(({ type, competencies, ...rest }) => {
        const filteredCompetencies = competencies
          .map(({ indicators, ...compRest }) => {
            const filteredIndicators = indicators.filter(({ name }) =>
              name.toLowerCase().includes(search.toLowerCase()),
            );

            return { ...compRest, indicators: filteredIndicators };
          })
          .filter(Boolean);

        return (!search.length || filteredCompetencies.length > 0) &&
          type === skillsFilter
          ? {
              ...rest,
              type,
              competencies: filteredCompetencies,
            }
          : null;
      })
      .filter(Boolean);
    return filteredData as CompetencyBlock[] | undefined;
  }, [data, skillsFilter, search]);

  // TODO: update active state
  return (
    <>
      <div className="flex justify-between gap-4">
        <InputWithLabelLight
          placeholder="Поиск..."
          value={search}
          onChange={searchFn}
        />
        <ArchiveButton />
      </div>
      <div className="flex gap-4 my-4">
        <SkillsSwitcher value={skillsFilter} setValue={setSkillsFilter} />
        <SoftButton
          size="xs"
          className="gap-2"
          onClick={() => {
            openModal('ADD_COMPETENCY_BLOCK', { skillType: skillsFilter });
          }}
        >
          <PlusCircleIcon className="h-5 w-5" />
          Добавить блок
        </SoftButton>
      </div>
      <CompetencyList
        data={filtereedData}
        openModal={openModal}
        loading={isFetching}
      />
    </>
  );
};

export default Competency;
