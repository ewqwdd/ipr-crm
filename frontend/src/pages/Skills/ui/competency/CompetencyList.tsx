import { CompetencyBlock } from '@/entities/skill';
import { Accordion } from '@/shared/ui/Accordion';
import { FC, memo } from 'react';
import { CompetencyType } from './types';
import CompetencyListItem from './CompetencyItem';
import { cva } from '@/shared/lib/cva';

type ICompetencyListProps = {
  data: CompetencyBlock[] | undefined;
  openModal: (type: string, data?: any) => void;
  loading?: boolean;
};

const CompetencyList: FC<ICompetencyListProps> = ({
  data,
  openModal,
  loading,
}) => {
  return (
    <div
      className={cva('grow flex flex-col mt-4', {
        'animate-pulse': !!loading,
      })}
    >
      {data?.map((skill) => (
        <Accordion
          key={skill.id}
          title={
            <>
              <CompetencyListItem
                {...skill}
                listItemType={CompetencyType.COMPETENCY_BLOCK}
                openModal={openModal}
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
                  title={
                    <CompetencyListItem
                      {...competency}
                      listItemType={CompetencyType.COMPETENCY}
                      openModal={openModal}
                    />
                  }
                >
                  {indicators.map((indicator) => (
                    <CompetencyListItem
                      key={indicator.id}
                      {...indicator}
                      listItemType={CompetencyType.INDICATOR}
                      openModal={openModal}
                    />
                  ))}
                </Accordion>
              );
            })}
          </div>
        </Accordion>
      ))}
    </div>
  );
};

export default memo(CompetencyList);
