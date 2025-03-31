import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { memo } from 'react';

interface TaskNameProps {
  name?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default memo(function TaskName({
  error,
  name,
  onChange,
}: TaskNameProps) {
  return (
    <InputWithLabelLight
      label="Название теста"
      onChange={onChange}
      value={name}
      error={error}
    />
  );
});
