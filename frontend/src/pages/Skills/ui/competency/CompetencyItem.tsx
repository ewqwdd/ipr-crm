import { FC } from 'react';
import { SoftButton } from '@/shared/ui/SoftButton';
import {
  MinusCircleIcon,
  PencilIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import { CompetencyListItemProps, CompetencyType } from './types';

const getCompetencyListItemStyles = (listItemType: CompetencyType) => {
  switch (listItemType) {
    case CompetencyType.COMPETENCY_BLOCK:
      return 'flex items-center justify-between items-center px-2';
    case CompetencyType.COMPETENCY:
      return 'flex items-center justify-between  pl-5 pr-2';
    case CompetencyType.INDICATOR:
      return 'flex items-center justify-between py-3 pl-10 pr-2 hover:bg-gray-200/80 transition-all duration-200 gap-2';

    default:
      return '';
  }
};

const CompetencyListItem: FC<CompetencyListItemProps> = ({
  listItemType,
  name,
  openModal,
  id,
}) => {
  return (
    <div className={getCompetencyListItemStyles(listItemType)}>
      <p className="text-black">{name}</p>
      <div className="flex items-center space-x-2">
        {listItemType === CompetencyType.COMPETENCY_BLOCK && (
          <SoftButton
            size="xs"
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              openModal('ADD_COMPETENCY', { competencyBlock: { id, name } });
            }}
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить компетенцию
          </SoftButton>
        )}
        {listItemType === CompetencyType.COMPETENCY && (
          <SoftButton
            size="xs"
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              openModal('ADD_INDICATOR', { competency: { id, name } });
            }}
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить индикатор
          </SoftButton>
        )}
        {listItemType === CompetencyType.INDICATOR && (
          <button
            className="border-b border-dashed text-indigo-600 border-indigo-600 h-6"
            onClick={() => {
              // TODO: add ADD_MATERIAL functionality
              console.log('open Modal ');
            }}
          >
            Подсказка
          </button>
        )}
        {listItemType !== CompetencyType.COMPETENCY_BLOCK && (
          <SoftButton
            size="xs"
            className="whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: add ADD_MATERIAL functionality
              console.log('ADD_MATERIAL', { competency: { id } });
              // openModal('ADD_MATERIAL', { competency: { id } });
              // setCompetency(competency);
              // setCurrent('ADD_INDICATOR');
            }}
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить Материалы
          </SoftButton>
        )}
        <SoftButton
          className="rounded-full p-2"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: add edit functionality BTW better to do using modal approach
            console.log('Edit', { competency: { id } });
            //   setCompetency(competency);
            //   setCurrent('ADD_INDICATOR');
          }}
        >
          <PencilIcon className="h-5 w-5" />
        </SoftButton>

        <SoftButton
          size="xs"
          className="rounded-full text-red p-2"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: add delete functionality
            console.log('Delete', { competency: { id } });
            //   setCompetency(competency);
            //   setCurrent('ADD_INDICATOR');
          }}
        >
          <MinusCircleIcon className="stroke-red-500 h-5 w-5" />
        </SoftButton>
      </div>
    </div>
  );
};

export default CompetencyListItem;
