import { User } from '@/entities/user';
import { displayName } from '@/shared/lib/displayName';
import { Checkbox } from '@/shared/ui/Checkbox';
import { StarIcon } from '@heroicons/react/outline';
import { ChangeEvent } from 'react';

interface UserCheckboxProps {
  user: User;
  selected?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  teamId?: number;
}

export default function UserCheckbox({
  onChange,
  user,
  selected,
  teamId,
}: UserCheckboxProps) {
  return (
    <Checkbox
      className="py-2 px-6"
      checked={!!selected}
      title={
        <span className="flex items-center">
          {displayName(user)}
          {!!user.teamCurator?.find((t) => t.id === teamId) && (
            <StarIcon className="size-5 text-yellow-400 ml-1" />
          )}
        </span>
      }
      onChange={onChange}
    />
  );
}
