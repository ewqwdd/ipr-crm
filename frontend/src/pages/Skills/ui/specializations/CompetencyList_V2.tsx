import { CompetencyBlock } from '@/entities/skill';
import { Accordion } from '@/shared/ui/Accordion';
import { FC, memo } from 'react';
import CompetencyListItem_V2 from './CompetencyListItem_V2';
import { cva } from '@/shared/lib/cva';

type ICompetencyListProps = {
  data: CompetencyBlock[] | undefined;
  openModal: (type: string, data?: unknown) => void;
  loading?: boolean;
  selectedSpec?: number;
};

export enum CompetencyType {
  COMPETENCY_BLOCK = 'COMPETENCY_BLOCK',
  COMPETENCY = 'COMPETENCY',
  INDICATOR = 'INDICATOR',
}

const CompetencyList_V2: FC<ICompetencyListProps> = ({
  data,
  openModal,
  loading,
  selectedSpec,
}) => {
  return (
    <div className="overflow-x-auto">
      <div
        className={cva('grow flex flex-col mt-4', {
          'animate-pulse': !!loading,
        })}
      >
        {data?.map((skill) => (
          <Accordion
            key={skill.id}
            btnClassName="overflow-y-auto"
            title={
              <>
                <CompetencyListItem_V2
                  {...skill}
                  listItemType={CompetencyType.COMPETENCY_BLOCK}
                  openModal={openModal}
                  skillType={skill.type}
                  selectedSpec={selectedSpec}
                />
              </>
            }
          >
            <div className="flex flex-col gap-2">
              {skill.competencies.map((competency) => {
                const { id, indicators } = competency;
                return (
                  <Accordion
                    key={id}
                    btnClassName="overflow-y-auto"
                    title={
                      <CompetencyListItem_V2
                        {...competency}
                        listItemType={CompetencyType.COMPETENCY}
                        openModal={openModal}
                        skillType={skill.type}
                        selectedSpec={selectedSpec}
                      />
                    }
                  >
                    {indicators.map((indicator) => (
                      <CompetencyListItem_V2
                        key={indicator.id}
                        {...indicator}
                        listItemType={CompetencyType.INDICATOR}
                        openModal={openModal}
                        skillType={skill.type}
                        selectedSpec={selectedSpec}
                      />
                    ))}
                  </Accordion>
                );
              })}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default memo(CompetencyList_V2);
