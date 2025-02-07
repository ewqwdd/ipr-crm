import { User } from '@/entities/user';
import { cva } from '@/shared/lib/cva';
import Select, { ActionMeta, MultiValue } from 'react-select';

export type Option = { value: number; label: string };

interface UserMultiSelectProps {
  users: User[];
  value?: MultiValue<Option>;
  onChange?: (
    newValue: MultiValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => void;
  loading?: boolean;
}

export default function UserMultiSelect({
  users,
  onChange,
  value,
  loading,
}: UserMultiSelectProps) {
  const options = users.map((user) => ({
    value: user.id,
    label: user.username,
  }));

  return (
    <Select
      isMulti
      name="colors"
      onChange={onChange}
      options={options}
      value={value}
      className={cva('basic-multi-select', {
        'animate-pulse': !!loading,
      })}
      classNamePrefix="select"
    />
  );
}
