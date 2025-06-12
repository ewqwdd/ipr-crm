import { SelectLight } from '@/shared/ui/SelectLight';
import { accessOptions, Filters } from './constants';
import { ChangeEvent } from 'react';

interface AccessSelectProps {
  onChangeAccess: (e: ChangeEvent<HTMLSelectElement>) => void;
  access: Filters['access'];
}

export default function AccessSelect({
  access,
  onChangeAccess,
}: AccessSelectProps) {
  return (
    <SelectLight value={access} onChange={onChangeAccess} label="Статус">
      {accessOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </SelectLight>
  );
}
