import { CompetencyBlock, CompetencyType } from '@/entities/skill';
import { Accordion } from '@/shared/ui/Accordion';
import { FC, memo, useState } from 'react';
import CompetencyListItem from './CompetencyItem';
import { cva } from '@/shared/lib/cva';
import { useModal } from '@/app/hooks/useModal';

type ICompetencyListProps = {
  data: CompetencyBlock[] | undefined;
  loading?: boolean;
  disabled?: boolean;
  type?: 'profile' | 'folder'; 
  folderId?: number;
};

const CompetencyList: FC<ICompetencyListProps> = ({
  data,
  loading,
  disabled,
  type = 'profile',
  folderId,
}) => {
  const { openModal } = useModal();

  const [list, setList] = useState<CompetencyBlock[]>(data || []);
  
  return (
    <div
      className={cva('grow flex flex-col mt-4', {
        'animate-pulse pointer-events-none': !!loading,
      })}
    >
      {list?.map((skill) => (
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
                pageType={type}
                folderId={folderId}
                setList={setList}
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
                      pageType={type}
                      folderId={folderId}
                      setList={setList}
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
                      pageType={type}
                      folderId={folderId}
                      setList={setList}
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
