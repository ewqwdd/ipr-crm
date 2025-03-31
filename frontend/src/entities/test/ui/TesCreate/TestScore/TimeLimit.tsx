import { Checkbox } from '@/shared/ui/Checkbox';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { digitRegex } from '@/shared/lib/regex';
import { memo } from 'react';

interface TimeLimitProps {
  limitByTime: boolean;
  timeLimit?: number;
  onToggleLimitByTime: (value: boolean) => void;
  onTimeLimitChange: (value: string) => void;
}

export default memo(function TimeLimit({
  limitByTime,
  onTimeLimitChange,
  onToggleLimitByTime,
  timeLimit,
}: TimeLimitProps) {
  const onChange = () => {
    onToggleLimitByTime(!limitByTime);
  };

  const onTimeLimitChange_ = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!digitRegex.test(value) && value !== '') return;
    onTimeLimitChange(value);
  };

  return (
    <>
      <Checkbox
        title="Ограничить время теста"
        onChange={onChange}
        checked={limitByTime}
        className="mt-8"
      />
      {limitByTime && (
        <InputWithLabelLight
          label="Время на тест (мин)"
          placeholder="60"
          value={timeLimit}
          onChange={onTimeLimitChange_}
        />
      )}
    </>
  );
});
