import { FC, useMemo, useState } from 'react';
import ChooseSpecialization from './ChooseSpecialization';
import { useModal } from '@/app/hooks/useModal';
import CompetencyList_V2 from './CompetencyList_V2';
import { Radio } from '@/shared/ui/Radio';
import { SoftButton } from '@/shared/ui/SoftButton';
import { skillsApi } from '@/shared/api/skillsApi';
import { cva } from '@/shared/lib/cva';
import { universalApi } from '@/shared/api/universalApi';

interface ICompetencyProps {
  selectedSpec: number | null;
}

const skillsFilters: Array<{ title: string; value: 'HARD' | 'SOFT' }> = [
  { title: 'Hard skills', value: 'HARD' },
  { title: 'Soft skills', value: 'SOFT' },
];

const CompetencyBlock: FC<ICompetencyProps> = ({ selectedSpec }) => {
  const [skillsFilter, setSkillsFilter] = useState<'HARD' | 'SOFT'>('HARD');
  const { data, isFetching } = skillsApi.useGetSkillsQuery();
  const { data: specs, isFetching: specsFetching } =
    universalApi.useGetSpecsQuery();

  const spec = specs?.find((item) => item.id === selectedSpec);

  const { openModal } = useModal();
  const specSkills = useMemo(
    () =>
      data?.filter(
        (item) =>
          spec?.competencyBlocks.find((block) => block.id === item.id) &&
          item.type === skillsFilter,
      ),
    [data, skillsFilter, spec?.competencyBlocks],
  );

  return (
    <div
      className={cva(
        'sm:p-4 max-sm:border border-gray-200 max-sm:border-b-0 p-2 max-sm:pt-4 max-sm:pb-10 max-sm:min-h-80',
        {
          'animate-pulse': isFetching || specsFetching,
        },
      )}
    >
      {selectedSpec === null ? (
        <ChooseSpecialization />
      ) : (
        <>
          <h2>Компетенции</h2>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex gap-4 my-4">
              {skillsFilters.map(({ title, value }) => (
                <Radio
                  key={value}
                  name="skills"
                  value={value}
                  checked={skillsFilter === value}
                  onChange={() => setSkillsFilter(value)}
                >
                  {title}
                </Radio>
              ))}
            </div>
            <SoftButton
              onClick={() => {
                openModal('CHOOSE_COMPETENCY_BLOCK', {
                  specId: spec?.id,
                  initialBlocks: spec?.competencyBlocks.map(
                    (block) => block.id,
                  ),
                });
              }}
            >
              Добавить
            </SoftButton>
          </div>
          <CompetencyList_V2
            data={specSkills}
            openModal={openModal}
            loading={false}
            selectedSpec={selectedSpec}
          />
        </>
      )}
    </div>
  );
};

export default CompetencyBlock;
