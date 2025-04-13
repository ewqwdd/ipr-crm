import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { memo } from 'react';

interface TaskNameProps {
  name?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default memo(function TaskName({
  error,
  name,
  onChange,
  placeholder = 'Название теста',
}: TaskNameProps) {
  return (
    <InputWithLabelLight
      label={placeholder}
      onChange={onChange}
      value={name}
      error={error}
    />
  );
});
