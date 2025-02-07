import { skillsApi } from '@/shared/api/skillsApi';
import { Heading } from '@/shared/ui/Heading';
import { Radio } from '@/shared/ui/Radio';
import { SoftButton } from '@/shared/ui/SoftButton';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import Modals from './Modals';
import { Competency, CompetencyBlock } from '@/entities/skill';

export type ModalType =
  | 'ADD_COMPETENCY_BLOCK'
  | 'ADD_COMPETENCY'
  | 'ADD_INDICATOR';

export default function Skills() {
  const { data } = skillsApi.useGetSkillsQuery();
  const [skillsFilter, setSkillsFilter] = useState<'HARD' | 'SOFT'>('HARD');
  const [current, setCurrent] = useState<ModalType | null>(null);
  const [competencyBlock, setCompetencyBlock] = useState<CompetencyBlock>();
  const [competency, setCompetency] = useState<Competency>();

  return (
    <>
      <div className="px-8 py-10 flex flex-col">
        <Heading
          title="Конструктор профилей"
          description="Реестр компетенций"
        />
        <div className="flex gap-4 my-4">
          <Radio
            name="skills"
            value="all"
            checked={skillsFilter === 'HARD'}
            onChange={() => setSkillsFilter('HARD')}
          >
            Hard skills
          </Radio>
          <Radio
            name="skills"
            value="soft"
            checked={skillsFilter === 'SOFT'}
            onChange={() => setSkillsFilter('SOFT')}
          >
            Soft skills
          </Radio>
          <SoftButton
            size="xs"
            className="gap-2"
            onClick={() => setCurrent('ADD_COMPETENCY_BLOCK')}
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить блок
          </SoftButton>
        </div>
        <div className="flex flex-col mt-4">
          {data?.map((skill) => (
            <>
              <div key={skill.id} className="flex gap-20 items-center">
                <p className="text-lg font-semibold">{skill.name}</p>
                <SoftButton
                  size="xs"
                  className="gap-2"
                  onClick={() => {
                    setCompetencyBlock(skill);
                    setCurrent('ADD_COMPETENCY');
                  }}
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Добавить компетенцию
                </SoftButton>
              </div>
              <div className="flex flex-col gap-2">
                {skill.competencies.map((competency) => (
                  <div key={competency.id} className="flex gap-20 items-center">
                    <p>{competency.name}</p>
                    <SoftButton
                      size="xs"
                      className="gap-2"
                      onClick={() => {
                        setCompetency(competency);
                        setCurrent('ADD_INDICATOR');
                      }}
                    >
                      <PlusCircleIcon className="h-5 w-5" />
                      Добавить индикатор
                    </SoftButton>
                  </div>
                ))}
              </div>
            </>
          ))}
        </div>
      </div>
      <Modals
        skillType={skillsFilter}
        current={current}
        setCurrent={setCurrent}
        competencyBlock={competencyBlock}
        competency={competency}
      />
    </>
  );
}
