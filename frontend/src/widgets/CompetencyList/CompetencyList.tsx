import { CompetencyBlock, CompetencyType } from '@/entities/skill';
import { Accordion } from '@/shared/ui/Accordion';
import { FC, memo } from 'react';
import CompetencyListItem from './CompetencyItem';
import { cva } from '@/shared/lib/cva';
import { useModal } from '@/app/hooks/useModal';

type ICompetencyListProps = {
  data: CompetencyBlock[] | undefined;
  loading?: boolean;
  disabled?: boolean;
};

const CompetencyList: FC<ICompetencyListProps> = ({
  data,
  loading,
  disabled,
}) => {
  const { openModal } = useModal();
  return (
    <div
      className={cva('grow flex flex-col mt-4', {
        'animate-pulse pointer-events-none': !!loading,
      })}
    >
      {data?.map((skill) => (
        <Accordion
          key={skill.id}
          btnClassName="overflow-y-auto"
          title={
            <>
              <CompetencyListItem
                {...skill}
                listItemType={CompetencyType.COMPETENCY_BLOCK}
                openModal={openModal}
                disabled={disabled}
                skillType={skill.type}
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
                    <CompetencyListItem
                      {...competency}
                      listItemType={CompetencyType.COMPETENCY}
                      openModal={openModal}
                      disabled={disabled}
                      skillType={skill.type}
                    />
                  }
                >
                  {indicators.map((indicator) => (
                    <CompetencyListItem
                      key={indicator.id}
                      {...indicator}
                      listItemType={CompetencyType.INDICATOR}
                      openModal={openModal}
                      disabled={disabled}
                      skillType={skill.type}
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
