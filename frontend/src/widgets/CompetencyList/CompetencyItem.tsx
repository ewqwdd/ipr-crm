import { FC } from 'react';
import { SoftButton } from '@/shared/ui/SoftButton';
import {
  MinusCircleIcon,
  PencilIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import { CompetencyListItemProps } from './types';
import { CompetencyType, useSkillsService } from '@/entities/skill';
import { cva } from '@/shared/lib/cva';
import { foldersApi } from '@/shared/api/foldersApi';

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

const CompetencyListItem: FC<CompetencyListItemProps> = ({
  listItemType,
  name,
  openModal,
  id,
  materials,
  boundary,
  disabled,
  hint1,
  hint2,
  hint3,
  hint4,
  hint5,
  value1,
  value2,
  value3,
  value4,
  value5,
  skipHint,
  skipValue,
  skillType,
  pageType = 'profile', // Default to 'profile' if not provided
  folderId,
  setList
}) => {
  const { competencyBlock, competency, indicator } = useSkillsService();

  const [removeBlockFromFolder, {isLoading: removeBlockLoading}] = foldersApi.useRemoveCompetencyBlocksFromSpecFolderMutation();

  const deleteCompetencyBlock = competencyBlock.delete[0];
  const deleteCompetency = competency.delete[0];
  const deleteIndicator = indicator.delete[0];

  const loading =
    competencyBlock.delete[1].isLoading ||
    competency.delete[1].isLoading ||
    indicator.delete[1].isLoading ||
    removeBlockLoading;

  return (
    <div
      className={cva(getCompetencyListItemStyles(listItemType), {
        'animate-pulse': loading,
      })}
    >
      <p className="text-black sm:min-w-[400px] min-w-[120px] max-sm:mr-2 text-nowrap max-sm:text-sm truncate">
        {name}
      </p>
      <div className="flex items-center space-x-2">
        {materials && materials.length > 0 && (
          <button
            className="text-left text-xs sm:text-sm text-gray-500 hover:text-gray-800 mr-2 text-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              openModal('MATERIALS_LIST', {
                materials,
                name,
                id,
                type: listItemType,
                disabled,
              });
              return;
            }}
          >
            {materials.length} Материалов
          </button>
        )}
        {listItemType === CompetencyType.COMPETENCY_BLOCK && !disabled && (
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
        {listItemType === CompetencyType.COMPETENCY && !disabled && (
          <SoftButton
            size="xs"
            className="gap-2 whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              openModal('ADD_INDICATOR', { id, name, skillType });
            }}
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить индикатор
          </SoftButton>
        )}

        {listItemType !== CompetencyType.COMPETENCY_BLOCK && !disabled && (
          <SoftButton
            size="xs"
            className="whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              if (listItemType === CompetencyType.COMPETENCY) {
                openModal('ADD_COMPETENCY_MATERIAL', { id, name });
              }
              if (listItemType === CompetencyType.INDICATOR) {
                openModal('ADD_INDICATOR_MATERIAL', { id, name });
              }
            }}
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить Материалы
          </SoftButton>
        )}
        {!disabled && (
          <>
            <SoftButton
              className="rounded-full p-2"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                openModal('EDIT_SKILL', {
                  id,
                  name,
                  type: listItemType,
                  boundary,
                  hints: { hint1, hint2, hint3, hint4, hint5, skipHint },
                  values: { value1, value2, value3, value4, value5, skipValue },
                  skillType: skillType,
                });
              }}
            >
              <PencilIcon className="h-5 w-5" />
            </SoftButton>

            {pageType === 'folder' && listItemType === CompetencyType.COMPETENCY_BLOCK && (
              <SoftButton
              size="xs"
              className="rounded-full p-2"
            danger
            onClick={() => {
              if (!folderId) return;
              removeBlockFromFolder({
                blockId: id,
                specFolderId: folderId,
              })
              setList?.((prev) => prev.filter((item) => item.id !== id));
            }}
            >
              <MinusCircleIcon className="h-5 w-5" />
            </SoftButton>)}

            {pageType === 'profile' && <SoftButton
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
            </SoftButton>}
          </>
        )}
      </div>
    </div>
  );
};

export default CompetencyListItem;
