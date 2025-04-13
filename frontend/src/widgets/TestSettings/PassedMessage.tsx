import { TextArea } from '@/shared/ui/TextArea';
import { memo } from 'react';

interface PassedMessageProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  passedMessage?: string;
  error?: string;
}

export default memo(function PassedMessage({
  onChange,
  error,
  passedMessage,
}: PassedMessageProps) {
  return (
    <TextArea
      label="Сообщение при завершении прохождения"
      onChange={onChange}
      value={passedMessage}
      error={error}
    />
  );
});
