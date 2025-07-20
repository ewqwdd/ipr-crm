import { userAccessOptions, UsersFilter } from '@/entities/user';
import { SelectLight } from '@/shared/ui/SelectLight';
import { ChangeEvent } from 'react';

interface AccessSelectProps {
  onChangeAccess: (e: ChangeEvent<HTMLSelectElement>) => void;
  access: UsersFilter['access'];
}

export default function AccessSelect({
  access,
  onChangeAccess,
}: AccessSelectProps) {
  return (
    <SelectLight
      value={access}
      onChange={onChangeAccess}
      label="Статус"
      containerClassName="min-[1300px]:col-span-2"
    >
      {userAccessOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </SelectLight>
  );
}
