import { User } from '@/entities/user';
import DatePickerLight from '@/shared/ui/DatePickerLight';
import React, { useMemo, useState } from 'react';
import { DateObject } from 'react-multi-date-picker';
import UsersList from './UsersList';
import { useAppSelector } from '@/app';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { usersService } from '@/shared/lib/usersService';

interface TestAssignedFormProps {
  users: User[];
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  role?: string;
}

export default function TestAssignedForm({
  users,
  selected,
  setSelected,
  date,
  setDate,
  role,
}: TestAssignedFormProps) {
  const teamAccess = useAppSelector((state) => state.user.user?.teamAccess);

  const [search, setSearch] = useState('');

  const groupedUsers = useMemo(() => {
    const teamMap = new Map<
      number,
      { teamId: number; team: { name: string } }
    >();

    users.forEach((user) => {
      const check = (id: number) =>
        !teamMap.has(id) && (role === 'admin' || teamAccess?.includes(id));
      user.teams?.forEach((team) => {
        if (check(team.teamId)) {
          teamMap.set(team.teamId, team);
        }
      });
      user.teamCurator?.forEach((team) => {
        if (check(team.id)) {
          teamMap.set(team.id, { teamId: team.id, team: { name: team.name } });
        }
      });
    });

    return Array.from(teamMap.values()).map((team) => ({
      ...team,
      users: [
        ...users.filter((user) =>
          user.teamCurator?.find((c) => c.id === team.teamId),
        ),
        ...users.filter((user) =>
          user.teams?.some((t) => t.teamId === team.teamId),
        ),
      ],
    }));
  }, [users, role, teamAccess]);

  const noTeamUsers = useMemo(() => {
    return users.filter(
      (user) =>
        (!user.teams || user.teams.length === 0) &&
        (!user.teamCurator || user.teamCurator.length === 0) &&
        (!search ||
          usersService
            .displayName(user)
            .toLowerCase()
            .includes(search.toLowerCase())),
    );
  }, [users, search]);

  const onDateChange = (date: DateObject | DateObject[] | undefined) => {
    if (!date) return;
    else if (Array.isArray(date)) {
      setDate(date[0].toDate());
    } else {
      setDate(date?.toDate());
    }
  };

  const filteredSearch = useMemo(() => {
    if (!search) return groupedUsers;
    return groupedUsers
      .map((team) =>
        team.team.name.toLowerCase().includes(search.toLowerCase())
          ? team
          : {
              ...team,
              users: team.users.filter((user) =>
                usersService
                  .displayName(user)
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              ),
            },
      )
      .filter((team) => team.users.length > 0);
  }, [search, groupedUsers]);

  const defaultProps = {
    selected,
    setSelected,
  };

  console.debug(noTeamUsers);

  return (
    <div className="flex flex-col gap-4 min-h-96">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mt-6 mb-2">
          <span className="text-sm text-gray-500 max-sm:text-left text-nowrap">
            Дата начала:
          </span>
          <DatePickerLight value={date} onChange={onDateChange} />
        </div>
        <InputWithLabelLight
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-80"
          placeholder="Поиск..."
        />
      </div>

      {role === 'admin' && noTeamUsers.length > 0 && (
        <UsersList
          {...defaultProps}
          team={{
            teamId: -1,
            team: { name: 'Без команды' },
            users: noTeamUsers,
          }}
        />
      )}
      {filteredSearch.map((team) => (
        <UsersList {...defaultProps} key={team.teamId} team={team} />
      ))}
    </div>
  );
}
