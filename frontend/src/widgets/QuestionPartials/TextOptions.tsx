import { CreateSurveyQuestion } from '@/entities/survey';
import { CreateQuestion } from '@/entities/test/types/types';
import { cva } from '@/shared/lib/cva';
import { digitRegex } from '@/shared/lib/regex';
import { Checkbox } from '@/shared/ui/Checkbox';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';

interface TextOptionsProps {
  index: number;
  correctRequired: boolean;
  onMaxLengthChange: (index: number, value: string | undefined) => void;
  onTextCorrectChange?: (index: number, value: string) => void;
  questions: CreateQuestion[] | CreateSurveyQuestion[];
  setMaxMinToggle: (index: number, value: boolean) => void;
}

export default function TextOptions({
  index,
  correctRequired,
  onMaxLengthChange,
  onTextCorrectChange,
  questions,
  setMaxMinToggle,
}: TextOptionsProps) {
  const question = questions[index];
  const type = question.type;
  const maxLength = question.maxLength;

  const maxLengthToggle = questions[index].maxMinToggle;

  // @ts-expect-error TODO fix type
  const textCorrectValue = questions[index].textCorrectValue;

  const onChangeMaxLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (digitRegex.test(value)) {
      onMaxLengthChange(index, value);
    }
  };

  const onChangeCorrect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!maxLengthToggle || value.length <= Number(maxLength)) {
      onTextCorrectChange?.(index, value);
    } else {
      onTextCorrectChange?.(index, value.slice(0, Number(maxLength)));
    }
  };

  if (type !== 'TEXT') return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex max-sm:flex-col max-sm:items-start gap-4 items-center">
        <Checkbox
          title="Ограничение длины"
          checked={maxLengthToggle}
          onChange={() => setMaxMinToggle(index, !maxLengthToggle)}
        />
        <InputWithLabelLight
          className={cva('transition-opacity', {
            'opacity-50': !maxLengthToggle,
          })}
          placeholder={'1024'}
          value={maxLength}
          onChange={onChangeMaxLength}
          disabled={!maxLengthToggle}
        />
      </div>

      {correctRequired && (
        <InputWithLabelLight
          label="Правильный ответ"
          onChange={onChangeCorrect}
          value={textCorrectValue}
          className={cva({
            'ring ring-red-500': textCorrectValue === '',
          })}
        />
      )}
    </div>
  );
}
