import { FC } from 'react';
import { SoftButton } from '@/shared/ui/SoftButton';
import { MinusCircleIcon, PencilIcon } from '@heroicons/react/outline';
// import { CompetencyListItemProps } from './types';
import {
  Competency,
  CompetencyBlock,
  Indicator,
  SkillType,
  useSkillsService,
} from '@/entities/skill';
import { cva } from '@/shared/lib/cva';

enum CompetencyType {
  COMPETENCY_BLOCK = 'COMPETENCY_BLOCK',
  COMPETENCY = 'COMPETENCY',
  INDICATOR = 'INDICATOR',
}

const getCompetencyListItemStyles = (listItemType: CompetencyType) => {
  switch (listItemType) {
    case CompetencyType.COMPETENCY_BLOCK:
      return 'flex items-center justify-between items-center px-2';
    case CompetencyType.COMPETENCY:
      return 'flex items-center justify-between  pl-5 pr-2';
    case CompetencyType.INDICATOR:
      return 'flex items-center justify-between py-3 pl-10 pr-2 hover:bg-gray-200/80 transition-all duration-200 gap-2 overflow-y-auto';

    default:
      return '';
  }
};

type CombineType = Competency | Indicator | CompetencyBlock;

type CompetencyListItemProps = CombineType & {
  listItemType: CompetencyType;
  skillType: SkillType;
  openModal: (type: string, data?: unknown) => void;
};

const CompetencyListItem_V2: FC<CompetencyListItemProps> = ({
  listItemType,
  name,
  openModal,
  id,
  skillType,
  materials,
  ...props
}) => {
  const { competencyBlock, competency, indicator } = useSkillsService();

  const deleteCompetencyBlock = competencyBlock.delete[0];
  const deleteCompetency = competency.delete[0];
  const deleteIndicator = indicator.delete[0];

  const loading =
    competencyBlock.delete[1].isLoading ||
    competency.delete[1].isLoading ||
    indicator.delete[1].isLoading;

  return (
    <div
      className={cva(getCompetencyListItemStyles(listItemType), {
        'animate-pulse': loading,
      })}
    >
      <p className="text-black sm:min-w-[400px] min-w-[120px] max-sm:text-sm">
        {name}
      </p>
      <div className="flex items-center space-x-2">
        {/* {listItemType === CompetencyType.COMPETENCY_BLOCK && (
          <SoftButton
            size="xs"
            className="gap-2 whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              openModal('ADD_COMPETENCY', { id, name });
            }}
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить компетенцию
          </SoftButton>
        )}
        {listItemType === CompetencyType.COMPETENCY && (
          <SoftButton
            size="xs"
            className="gap-2 whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              openModal('ADD_INDICATOR', { id, name });
            }}
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить индикатор
          </SoftButton>
        )} */}
        {/* {listItemType !== CompetencyType.COMPETENCY_BLOCK && (
          <SoftButton
            size="xs"
            className="whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              if (listItemType === CompetencyType.COMPETENCY) {
                openModal('ADD_COMPETENCY_MATERIAL', { name, id, ...props });
              }
              if (listItemType === CompetencyType.INDICATOR) {
                openModal('ADD_INDICATOR_MATERIAL', { name, id, ...props });
              }
            }}
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить Материалы
          </SoftButton>
        )} */}
        {listItemType !== CompetencyType.COMPETENCY_BLOCK && materials && (
          <button
            className="text-left text-xs text-nowrap sm:text-sm text-gray-500 hover:text-gray-800 sm:mr-2"
            onClick={(e) => {
              if (materials.length > 0) {
                openModal('MATERIALS_LIST', {
                  materials,
                  name,
                  id,
                  type: listItemType,
                });
                return;
              }
              e.stopPropagation();
              if (listItemType === CompetencyType.COMPETENCY) {
                openModal('ADD_COMPETENCY_MATERIAL', { name, id, ...props });
              }
              if (listItemType === CompetencyType.INDICATOR) {
                openModal('ADD_INDICATOR_MATERIAL', { name, id, ...props });
              }
            }}
          >
            {materials.length > 0
              ? `${materials.length} Материалов`
              : '0 Метериалов'}
          </button>
        )}
        <SoftButton
          className="rounded-full p-2"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            openModal('EDIT_SKILL', {
              id,
              name,
              type: listItemType,
              skillType,
            });
          }}
        >
          <PencilIcon className="h-5 w-5" />
        </SoftButton>

        <SoftButton
          size="xs"
          className="rounded-full text-red p-2"
          onClick={(e) => {
            e.stopPropagation();
            let onSubmit = null;
            switch (listItemType) {
              case CompetencyType.COMPETENCY_BLOCK:
                onSubmit = () => deleteCompetencyBlock({ id });
                break;
              case CompetencyType.COMPETENCY:
                onSubmit = () => deleteCompetency({ id });
                break;
              case CompetencyType.INDICATOR:
                onSubmit = () => deleteIndicator({ id });
                break;
              default:
                break;
            }
            openModal('CONFIRM', { onSubmit });
          }}
        >
          <MinusCircleIcon className="stroke-red-500 h-5 w-5" />
        </SoftButton>
      </div>
    </div>
  );
};

export default CompetencyListItem_V2;
