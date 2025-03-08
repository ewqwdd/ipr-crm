import { Team } from '@/entities/team';
import { User } from '@/entities/user';
import { teamsApi } from '@/shared/api/teamsApi';
import { FC, memo } from 'react';
import { getCuratorsAndMembers, getTeamMembers } from './helpers';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
type WorkSpaceProps = {
  user?: User;
};

const WorkSpace: FC<WorkSpaceProps> = ({ user }) => {
  const { data: teams, isFetching: teamsFetching } =
    teamsApi.useGetTeamsQuery();

  // Руководители
  // Коллеги
  const { curators, members } = getCuratorsAndMembers(
    teams?.list as Team[],
    user?.teams as unknown as { teamId: number; team: { name: string } }[],
    user?.username as string,
  );

  // Подчиненные
  const teamMembers = getTeamMembers(
    teams?.list as Team[],
    user?.teamCurator as unknown as {
      id: number;
      name: string;
    }[],
  );

  return (
    <LoadingOverlay active={teamsFetching}>
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
              {teamMembers?.map((member) => (
                <li key={member?.toString()}>{member}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default memo(WorkSpace);
