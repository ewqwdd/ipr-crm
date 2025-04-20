import { User } from '@/entities/user';
import { UserCheckbox } from '@/widgets/UserCheckbox';
import { UsersIcon } from '@heroicons/react/outline';

interface UsersListProps {
  team: { team: { name: string }; teamId: number; users: User[] };
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function UsersList({
  team,
  selected,
  setSelected,
}: UsersListProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-violet-500 max-sm:text-left max-sm: pl-6">
        <UsersIcon className="w-5 h-5 mr-2 inline" />
        {team.team?.name}
      </h2>
      <div className="flex flex-col gap-2">
        {team.users.map((user) => (
          <UserCheckbox
            key={user.id}
            user={{ ...user, teamCurator: [] }}
            selected={selected.includes(user.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelected([...selected, user.id]);
              } else {
                setSelected(selected.filter((id) => id !== user.id));
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
