import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { cva } from '@/shared/lib/cva';
import { digitRegex, floatRegex } from '@/shared/lib/regex';
import { Checkbox } from '@/shared/ui/Checkbox';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useEffect, useState } from 'react';

interface NumberOptionsProps {
  index: number;
  correctRequired: boolean;
}

export default function NumberOptions({
  index,
  correctRequired,
}: NumberOptionsProps) {
  const type = useAppSelector(
    (state) => state.testCreate.questions[index].type,
  );
  const allowDecimal = useAppSelector(
    (state) => state.testCreate.questions[index].allowDecimal,
  );
  const dispatch = useAppDispatch();
  const [maxLengthToggle, setMaxLengthToggle] = useState(false);
  const numberCorrectValue = useAppSelector((state) =>
    state.testCreate.questions[index].numberCorrectValue?.toString(),
  );

  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  const onChangeCorrect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = allowDecimal ? floatRegex : digitRegex;
    if (!regex.test(value) && value !== '') return;
    dispatch(
      testCreateActions.setQuestionField({
        index,
        field: 'numberCorrectValue',
        value: value,
      }),
    );
  };

  const allowDecimalChange = () => {
    dispatch(
      testCreateActions.setQuestionField({
        index,
        field: 'allowDecimal',
        value: !allowDecimal,
      }),
    );
  };

  useEffect(() => {
    if (!allowDecimal) {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'numberCorrectValue',
          value: (numberCorrectValue ?? '')?.split('.')[0],
        }),
      );
    }
  }, [allowDecimal, numberCorrectValue, index, dispatch]);

  useEffect(() => {
    if (maxLengthToggle) {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'maxNumber',
          value: maxValue,
        }),
      );
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'minNumber',
          value: minValue,
        }),
      );
    } else {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'maxNumber',
          value: undefined,
        }),
      );
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'minNumber',
          value: undefined,
        }),
      );
    }
  }, [maxLengthToggle, minValue, maxValue, index, dispatch]);

  const onChangeMinValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (digitRegex.test(value) || value === '') {
      setMinValue(value);
    }
  };

  const onChangeMaxValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (digitRegex.test(value) || value === '') {
      setMaxValue(value);
    }
  };

  if (type !== 'NUMBER') return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Checkbox
        title="Разрешить десятичные"
        checked={allowDecimal}
        onChange={allowDecimalChange}
      />
      <div className="flex gap-4 items-center">
        <Checkbox
          title="Мин/макс значение"
          checked={maxLengthToggle}
          onChange={() => setMaxLengthToggle((p) => !p)}
        />

        <InputWithLabelLight
          className={cva('transition-opacity max-w-20 ml-4', {
            'opacity-50': !maxLengthToggle,
          })}
          placeholder={'0'}
          value={minValue}
          onChange={onChangeMinValue}
          disabled={!maxLengthToggle}
        />

        <InputWithLabelLight
          className={cva('transition-opacity max-w-20', {
            'opacity-50': !maxLengthToggle,
          })}
          placeholder={'8'}
          value={maxValue}
          onChange={onChangeMaxValue}
          disabled={!maxLengthToggle}
        />
      </div>

      {correctRequired && (
        <InputWithLabelLight
          label="Правильный ответ"
          onChange={onChangeCorrect}
          value={numberCorrectValue}
        />
      )}
    </div>
  );
}
