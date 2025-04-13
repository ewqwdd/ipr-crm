import { TextArea } from '@/shared/ui/TextArea';
import { memo } from 'react';

interface TaskDescriptionProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  description?: string;
  error?: string;
}

export default memo(function TaskDescription({
  onChange,
  description,
  error,
}: TaskDescriptionProps) {
  return (
    <TextArea
      label="Описание"
      onChange={onChange}
      value={description}
      error={error}
    />
  );
});
