import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { cva } from '@/shared/lib/cva';
import { digitRegex } from '@/shared/lib/regex';
import { Checkbox } from '@/shared/ui/Checkbox';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useEffect, useState } from 'react';

interface TextOptionsProps {
  index: number;
  correctRequired: boolean;
}

export default function TextOptions({
  index,
  correctRequired,
}: TextOptionsProps) {
  const type = useAppSelector(
    (state) => state.testCreate.questions[index].type,
  );
  const dispatch = useAppDispatch();
  const [maxLengthToggle, setMaxLengthToggle] = useState(false);
  const [maxLength, setMaxLength] = useState('');
  const textCorrectValue = useAppSelector(
    (state) => state.testCreate.questions[index].textCorrectValue,
  );

  const onChangeMaxLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (digitRegex.test(value)) {
      setMaxLength(value);
    }
  };

  const onChangeCorrect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!maxLengthToggle || value.length <= Number(maxLength)) {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'textCorrectValue',
          value: value,
        }),
      );
    } else {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'textCorrectValue',
          value: value.slice(0, Number(maxLength)),
        }),
      );
    }
  };

  useEffect(() => {
    if (maxLengthToggle) {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'maxLength',
          value: maxLength,
        }),
      );
    } else {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'maxLength',
          value: undefined,
        }),
      );
    }
  }, [maxLengthToggle, maxLength, index, dispatch]);

  if (type !== 'TEXT') return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex gap-4 items-center">
        <Checkbox
          title="Ограничение длины"
          checked={maxLengthToggle}
          onChange={() => setMaxLengthToggle((p) => !p)}
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
        />
      )}
    </div>
  );
}
