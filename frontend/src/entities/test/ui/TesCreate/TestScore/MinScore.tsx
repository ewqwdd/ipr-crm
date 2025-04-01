import { Checkbox } from '@/shared/ui/Checkbox';
import { memo, useState } from 'react';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { digitRegex } from '@/shared/lib/regex';

interface MinScoreProps {
  maxScore: number;
  minimumScore?: number;
  onChangeMinimumScore: (value?: string) => void;
}

export default memo(function MinScore({
  maxScore,
  minimumScore,
  onChangeMinimumScore,
}: MinScoreProps) {
  const [checked, setChecked] = useState(Number.isInteger(minimumScore));

  const onToggleMinScore = () => {
    if (checked) {
      onChangeMinimumScore(undefined);
    }
    setChecked(!checked);
  };

  const onMinScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== '') {
      if (!digitRegex.test(value)) return;
      if (parseInt(value) > maxScore) return;
    }
    onChangeMinimumScore(value);
  };

  return (
    <>
      <Checkbox
        title="Оценка результата зачет/незачет"
        checked={checked}
        onChange={onToggleMinScore}
      />
      {checked && (
        <InputWithLabelLight
          className="mb-2"
          label="Зачетный минимум"
          placeholder={`Максимум ${maxScore}`}
          value={minimumScore}
          onChange={onMinScoreChange}
        />
      )}
    </>
  );
});
