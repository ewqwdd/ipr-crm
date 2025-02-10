import { FC, useState } from 'react';
import ChooseSpecialization from './ChooseSpecialization';
import { useModal } from '@/app/hooks/useModal';
import CompetencyList_V2 from './CompetencyList_V2';
import { Radio } from '@/shared/ui/Radio';
import { SoftButton } from '@/shared/ui/SoftButton';
interface ICompetencyProps {
  //
}

const mock = [
  {
    id: 1,
    name: 'Аналитика в дизайне',
    specId: null,
    type: 'HARD',
    competencies: [
      {
        id: 1,
        name: 'Иследование конкурентов',
        blockId: 1,
        materials: [],
        indicators: [
          {
            id: 1,
            name: ' Статистика, анализ и визуализация больших объемов данных ',
            description: null,
            competencyId: 1,
            materials: [],
          },
          {
            id: 2,
            name: 'Тест Индикатор 1',
            description: null,
            competencyId: 1,
            materials: [],
          },
          {
            id: 8,
            name: 'test',
            description: null,
            competencyId: 1,
            materials: [],
          },
          {
            id: 3,
            name: 'TEST indicat',
            description: null,
            competencyId: 1,
            materials: [],
          },
        ],
      },
    ],
  },
];

const skillsFilters: Array<{ title: string; value: 'HARD' | 'SOFT' }> = [
  { title: 'Hard skills', value: 'HARD' },
  { title: 'Soft skills', value: 'SOFT' },
];

const CompetencyBlock: FC<ICompetencyProps> = (props) => {
  const isExist = true;
  const [skillsFilter, setSkillsFilter] = useState<'HARD' | 'SOFT'>('HARD');

  const { openModal } = useModal();

  return (
    <div className="p-4">
      {!isExist ? (
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
                openModal('CHOOSE_COMPETENCY_BLOCK');
              }}
            >
              Добавить
            </SoftButton>
          </div>
          <CompetencyList_V2
            data={mock}
            openModal={openModal}
            loading={false}
          />
        </>
      )}
    </div>
  );
};

export default CompetencyBlock;
