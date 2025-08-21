import { useState } from 'react';
import { Case, CaseCreateDto } from '../../types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { TextArea } from '@/shared/ui/TextArea';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { SoftButton } from '@/shared/ui/SoftButton';
import { XIcon } from '@heroicons/react/outline';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { Checkbox } from '@/shared/ui/Checkbox';

interface CaseFormProps {
  initialCase?: Case;
  onSubmit: (data: CaseCreateDto) => void;
}

export default function CaseForm({ initialCase, onSubmit }: CaseFormProps) {
  const [caseValue, setCaseValue] = useState<CaseCreateDto>(
    initialCase
      ? {
          ...initialCase,
          variants: initialCase.variants.map((variant) => ({
            name: variant.name,
            value: variant.value,
          })),
        }
      : {
          name: '',
          description: '',
          variants: [
            {
              name: 'Не соответствует ожиданиям',
              value: 1,
            },
            {
              name: 'Частично соответствует ожиданиям',
              value: 2,
            },
            {
              name: 'Соответствует ожиданиям',
              value: 3,
            },
            {
              name: 'Ответ выше ожиданий',
              value: 4,
            },
            {
              name: 'Превосходит все ожидания',
              value: 5,
            },
          ],
        },
  );
  const [variantsError, setVariantsError] = useState<Record<string, string>>(
    {},
  );
  const [nameError, setNameError] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);

  const values = caseValue.variants.map((variant) => variant.value);
  let valueToAdd;
  if (!values.some((value) => value === 1)) {
    valueToAdd = 1;
  } else {
    const found = values.find(
      (variant) => !values.some((v) => v === variant + 1),
    );
    valueToAdd = found ? found + 1 : 1;
  }

  const handleSubmit = () => {
    let valid = true;
    if (!caseValue.name) {
      setNameError('Название не может быть пустым');
      valid = false;
    }
    if (caseValue.variants.length === 0) {
      valid = false;
      setError('Варианты не могут быть пустыми');
    }
    const variantErrors: Record<string, string> = {};
    caseValue.variants.forEach((variant, index) => {
      if (!variant.name) {
        variantErrors[index] = 'Название не может быть пустым';
        valid = false;
      }
      if (!variant.value) {
        variantErrors[index] = 'Значение не может быть пустым';
        valid = false;
      }
    });

    const values = caseValue.variants
      .map((variant) => variant.value)
      .filter(Boolean);
    const duplicateValues = values.filter(
      (value, index) => values.indexOf(value) !== index,
    );

    if (duplicateValues.length > 0) {
      caseValue.variants.forEach((variant, index) => {
        if (duplicateValues.includes(variant.value)) {
          variantErrors[index] = 'Значение должно быть уникальным';
          valid = false;
        }
      });
    }

    setVariantsError(variantErrors);

    if (valid) {
      onSubmit(caseValue);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-3">
      <InputWithLabelLight
        error={nameError}
        label="Название"
        value={caseValue.name}
        onChange={(e) => {
          setNameError('');
          setCaseValue({ ...caseValue, name: e.target.value });
        }}
      />
      <TextArea
        label="Описание"
        value={caseValue.description}
        onChange={(e) =>
          setCaseValue({ ...caseValue, description: e.target.value })
        }
      />
      <Checkbox
        checked={caseValue.commentEnabled}
        onChange={() =>
          setCaseValue({
            ...caseValue,
            commentEnabled: !caseValue.commentEnabled,
          })
        }
        title="Включить комментарий"
      />
      <div className="flex flex-col gap-1.5">
        {caseValue.variants.map((variant, index) => (
          <div
            key={index}
            className="grid gap-3 items-start"
            style={{
              gridTemplateColumns: 'auto max(80px) max(40px)',
            }}
          >
            <InputWithLabelLight
              error={variantsError[index]}
              label="Вариант ответа"
              value={variant.name}
              onChange={(e) => {
                setVariantsError({ ...variantsError, [index]: '' });
                const newVariants = [...caseValue.variants];
                newVariants[index] = { ...variant, name: e.target.value };
                setCaseValue({ ...caseValue, variants: newVariants });
              }}
            />
            <InputWithLabelLight
              type="number"
              label="Значение"
              value={variant.value.toString()}
              onChange={(e) => {
                if (Number(e.target.value) < 1) return;
                setVariantsError({ ...variantsError, [index]: '' });
                const newVariants = [...caseValue.variants];
                newVariants[index] = {
                  ...variant,
                  value: Number(e.target.value),
                };
                setCaseValue({ ...caseValue, variants: newVariants });
              }}
            />
            <SoftButton
              className="p-0 size-[38px] mt-[24px]"
              danger
              onClick={() =>
                setCaseValue({
                  ...caseValue,
                  variants: caseValue.variants.filter((_, i) => i !== index),
                })
              }
            >
              <XIcon className="w-4 h-4" />
            </SoftButton>
          </div>
        ))}
        <SecondaryButton
          className="mt-3"
          onClick={() => {
            setCaseValue({
              ...caseValue,
              variants: [
                ...caseValue.variants,
                { name: '', value: valueToAdd },
              ],
            });
            setError('');
          }}
        >
          Добавить вариант
        </SecondaryButton>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
      <PrimaryButton className="self-end  mt-5" onClick={handleSubmit}>
        Подтвердить
      </PrimaryButton>
    </div>
  );
}
