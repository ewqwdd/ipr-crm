import { FC, memo } from 'react';
import { getCuratorsAndMembers } from './helpers';
import { Rate } from '@/entities/rates';

type WorkSpaceProps = {
  rate?: Rate;
};

const WorkSpace: FC<WorkSpaceProps> = ({ rate }) => {
  // Руководители
  // Коллеги
  // Подчиненные
  const { curators, members, subbordinates } = getCuratorsAndMembers(
    rate?.evaluators ?? [],
  );

  return (
    <div className="flex border border-solid border-gray-300 rounded-md">
      <div className="border-r border-solid border-gray-300 p-3 font-medium">
        Окружение
      </div>
      <div className="w-full">
        <div className="border-b border-solid border-gray-300 p-3">
          <h4 className="font-medium">Руководители</h4>
          <ul>
            {curators &&
              curators.map((curator) => (
                <li key={curator?.toString()}>{curator}</li>
              ))}
          </ul>
        </div>
        <div className="border-b border-solid border-gray-300 p-3">
          <h4 className="font-medium">Коллеги</h4>
          <ul>
            {members &&
              members.map((member) => {
                return <li key={member?.toString()}>{member}</li>;
              })}
          </ul>
        </div>
        <div className="p-3">
          <h4 className="font-medium">Подчиненные</h4>
          <ul>
            {subbordinates?.map((member) => (
              <li key={member?.toString()}>{member}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default memo(WorkSpace);
