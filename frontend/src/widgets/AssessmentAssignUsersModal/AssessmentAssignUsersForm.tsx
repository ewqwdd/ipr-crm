import { User } from '@/entities/user';
import DatePickerLight from '@/shared/ui/DatePickerLight';
import React, { useMemo } from 'react';
import { DateObject } from 'react-multi-date-picker';
import UsersList from './UsersList';

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
  const groupedUsers = useMemo(() => {
    const teamMap = new Map<
      number,
      { teamId: number; team: { name: string } }
    >();

    users.forEach((user) => {
      user.teams?.forEach((team) => {
        if (!teamMap.has(team.teamId)) {
          teamMap.set(team.teamId, team);
        }
      });
    });

    return Array.from(teamMap.values()).map((team) => ({
      ...team,
      users: users.filter((user) =>
        user.teams?.some((t) => t.teamId === team.teamId),
      ),
    }));
  }, [users]);

  const noTeamUsers = useMemo(() => {
    return users.filter((user) => !user.teams || user.teams.length === 0);
  }, [users]);

  const onDateChange = (date: DateObject | DateObject[] | undefined) => {
    if (!date) return;
    else if (Array.isArray(date)) {
      setDate(date[0].toDate());
    } else {
      setDate(date?.toDate());
    }
  };

  const defaultProps = {
    selected,
    setSelected,
  };

  return (
    <div className="flex flex-col gap-4 min-h-96">
      <div className="flex items-center gap-2 mt-6 mb-2">
        <span className="text-sm text-gray-500 max-sm:text-left text-nowrap">
          Дата начала:
        </span>
        <DatePickerLight value={date} onChange={onDateChange} />
      </div>
      {role === 'admin' && (
        <UsersList
          {...defaultProps}
          team={{
            teamId: -1,
            team: { name: 'Без команды' },
            users: noTeamUsers,
          }}
        />
      )}
      {groupedUsers.map((team) => (
        <UsersList {...defaultProps} key={team.teamId} team={team} />
      ))}
    </div>
  );
}
