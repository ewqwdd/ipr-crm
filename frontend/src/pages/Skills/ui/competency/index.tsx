import { FC, useMemo, useState } from 'react';
import { SoftButton } from '@/shared/ui/SoftButton';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { skillsApi } from '@/shared/api/skillsApi';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { CompetencyBlock, SkillsSwitcher } from '@/entities/skill';
import { useModal } from '@/app/hooks/useModal';
import ArchiveButton from '../ArchiveButton';
import { CompetencyList } from '@/widgets/CompetencyList';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { cva } from '@/shared/lib/cva';

interface CompetencyProps {
  archiveMutation: ReturnType<typeof skillsApi.useArchiveAllMutation>;
}

const Competency: FC<CompetencyProps> = ({ archiveMutation }) => {
  const [skillsFilter, setSkillsFilter] = useState<'HARD' | 'SOFT'>('HARD');
  const [search, setSearch] = useState('');

  const { data, isFetching } = skillsApi.useGetSkillsQuery();
  const { openModal } = useModal();

  // TODO: replace loading

  const searchFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filtereedData = useMemo((): CompetencyBlock[] | undefined => {
    if (!data) return;
    return data
      .map((item) => {
        const filteredCompetencies = item.competencies
          .map((comp) => {
            const filteredIndicators = comp.indicators.filter((indicator) =>
              indicator.name.toLowerCase().includes(search.toLowerCase()),
            );
            return {
              ...comp,
              indicators: filteredIndicators,
            };
          })
          .filter(
            (comp) =>
              comp.indicators.length > 0 ||
              comp.name.toLowerCase().includes(search.toLowerCase()),
          );
        return {
          ...item,
          competencies: filteredCompetencies,
        };
      })
      .filter(
        (item) =>
          skillsFilter === item.type &&
          (item.competencies.length > 0 ||
            item.name.toLowerCase().includes(search.toLowerCase())),
      );
  }, [search, data, skillsFilter]);

  // TODO: update active state
  return (
    <LoadingOverlay active={isFetching}>
      <div className="flex justify-between gap-4 max-sm:flex-col max-sm:mt-6">
        <InputWithLabelLight
          placeholder="Поиск..."
          value={search}
          onChange={searchFn}
        />
        <ArchiveButton archiveMutation={archiveMutation} />
      </div>
      <div
        className={cva('sm:flex gap-4 my-4 grid grid-cols-2', {
          'pointer-events-none animate-pulse': archiveMutation[1].isLoading,
        })}
      >
        <SkillsSwitcher value={skillsFilter} setValue={setSkillsFilter} />
        <SoftButton
          size="xs"
          className="gap-2 max-sm:col-span-2"
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
        loading={isFetching || archiveMutation[1].isLoading}
      />
    </LoadingOverlay>
  );
};

export default Competency;
