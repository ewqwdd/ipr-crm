import { FC, memo } from 'react';
import { cva } from '@/shared/lib/cva';
import {
  FolderIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import { SoftButton } from '@/shared/ui/SoftButton';
import { foldersApi } from '@/shared/api/foldersApi';
import { FolderType } from '@/entities/folders';
import { useModal } from '@/app/hooks/useModal';

type FolderItemProps = {
  id: number;
  name: string;
  folderType: FolderType;
  disabled?: boolean;
  parentId?: number;
  initialBlocks?: number[];
};

const FolderItem: FC<FolderItemProps> = ({
  id,
  name,
  folderType,
  disabled,
  initialBlocks = [],
}) => {
  const { openModal } = useModal();

  const [deleteProductFolder, deleteProductFolderProps] =
    foldersApi.useDeleteProductFolderMutation();
  const [deleteTeamFolder, deleteTeamFolderProps] =
    foldersApi.useDeleteTeamFolderMutation();
  const [deleteSpecFolder, deleteSpecFolderProps] =
    foldersApi.useDeleteSpecFolderMutation();

  const [setCompetencyBlocks] =
    foldersApi.useSetCompetencyBlocksForSpecFolderMutation();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('EDIT_FOLDER', { id, name, folderType });
  };

  // Определяем отступ в зависимости от типа папки
  const indentClass = cva('flex items-center gap-2 w-full', {
    'pl-0': folderType === FolderType.PRODUCT,
    'pl-4': folderType === FolderType.TEAM,
    'pl-8': folderType === FolderType.SPEC,
  });

  // Определяем цвет иконки в зависимости от типа папки
  const iconColorClass = cva('h-5 w-5', {
    'text-blue-500': folderType === FolderType.PRODUCT,
    'text-green-500': folderType === FolderType.TEAM,
    'text-purple-500': folderType === FolderType.SPEC,
  });

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (folderType === FolderType.PRODUCT) {
      openModal('ADD_TEAM_FOLDER', { productId: id, name });
    } else if (folderType === FolderType.TEAM) {
      openModal('ADD_SPEC_FOLDER', { teamId: id, name });
    } else if (folderType === FolderType.SPEC) {
      openModal('CHOOSE_COMPETENCY_BLOCK', {
        initialBlocks,
        onSubmit: async (blocks: number[]) => {
          return await setCompetencyBlocks({
            id,
            competencyBlockIds: blocks,
          });
        },
      });
    }
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    openModal('CONFIRM', {
      submitText: 'Удалить',
      title: 'Удалить выбранную папку?',
      onSubmit: async () => {
        if (folderType === FolderType.PRODUCT) {
          return await deleteProductFolder({ id });
        } else if (folderType === FolderType.TEAM) {
          return await deleteTeamFolder({ id });
        } else if (folderType === FolderType.SPEC) {
          return await deleteSpecFolder({ id });
        }
      },
    });
  };

  const loading =
    deleteProductFolderProps.isLoading ||
    deleteTeamFolderProps.isLoading ||
    deleteSpecFolderProps.isLoading;

  return (
    <div
      className={cva('flex items-center justify-between w-full py-2', {
        'animate-pulse pointer-events-none': loading,
      })}
    >
      <div className={indentClass}>
        <FolderIcon className={iconColorClass} />
        <span className="font-medium">{name}</span>
      </div>

      <SoftButton onClick={onAdd} className="mr-4">
        <PlusCircleIcon className="h-5 w-5" />
        <span className="ml-1">Добавить</span>
      </SoftButton>

      {!disabled && (
        <div className="flex items-center gap-2">
          <SoftButton
            onClick={handleEdit}
            className="p-1 hover:bg-gray-100 rounded-full"
            title="Редактировать"
          >
            <PencilIcon className="size-5 text-indigo-500" />
          </SoftButton>
          <SoftButton
            onClick={onDelete}
            className="p-1 hover:bg-gray-100 rounded-full"
            title="Удалить"
          >
            <TrashIcon className="size-5 text-red-500" />
          </SoftButton>
        </div>
      )}
    </div>
  );
};

export default memo(FolderItem);
