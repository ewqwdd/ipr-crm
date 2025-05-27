import {
  FolderType,
  ProfileConstructorFolderProduct,
} from '@/entities/folders';
import { Accordion } from '@/shared/ui/Accordion';
import { FC, memo } from 'react';
import { cva } from '@/shared/lib/cva';
import StructureFolderItem from './StructureFolderItem';

type IFoldersListProps = {
  data: ProfileConstructorFolderProduct[] | undefined;
  loading?: boolean;
  disabled?: boolean;
};

const FoldersList: FC<IFoldersListProps> = ({ data, loading, disabled }) => {
  return (
    <div
      className={cva('grow flex flex-col mt-4', {
        'animate-pulse pointer-events-none': !!loading,
      })}
    >
      {data?.map((product) => (
        <Accordion
          key={product.id}
          btnClassName="overflow-y-auto"
          title={
            <StructureFolderItem
              id={product.id}
              name={product.name}
              folderType={FolderType.PRODUCT}
              disabled={disabled}
            />
          }
        >
          <div className="flex flex-col gap-2">
            {product.teams?.map((team) => (
              <Accordion
                key={team.id}
                btnClassName="overflow-y-auto"
                title={
                  <StructureFolderItem
                    id={team.id}
                    name={team.name}
                    folderType={FolderType.TEAM}
                    disabled={disabled}
                    parentId={product.id}
                  />
                }
              >
                <div className="flex flex-col gap-2">
                  {team.specs?.map((spec) => (
                    <StructureFolderItem
                      key={spec.id}
                      id={spec.id}
                      name={spec.name}
                      folderType={FolderType.SPEC}
                      disabled={disabled}
                      initialBlocks={
                        spec.competencyBlocks?.map((block) => block.id) || []
                      }
                    />
                  ))}
                </div>
              </Accordion>
            ))}
          </div>
        </Accordion>
      ))}
    </div>
  );
};

export default memo(FoldersList);
