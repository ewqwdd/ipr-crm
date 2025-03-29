import { User } from '@/entities/user';
import { Checkbox } from '@/shared/ui/Checkbox';
import { StarIcon } from '@heroicons/react/outline';
import { ChangeEvent } from 'react';

interface UserCheckboxProps {
  user: User;
  selected?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function UserCheckbox({
  onChange,
  user,
  selected,
}: UserCheckboxProps) {
  return (
    <Checkbox
      className="py-2 px-6"
      checked={!!selected}
      title={
        <span className="flex items-center">
          {user.username}
          {!!user.teamCurator?.length && (
            <StarIcon className="size-5 text-yellow-400 ml-1" />
          )}
        </span>
      }
      onChange={onChange}
    />
  );
}
