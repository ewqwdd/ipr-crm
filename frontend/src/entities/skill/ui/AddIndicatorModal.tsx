import { Modal } from '@/shared/ui/Modal';
import { Competency, Hints, HintValues, SkillType } from '../types/types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { skillsApi } from '@/shared/api/skillsApi';
import { EditHints } from './EditHints';
import {
  hintsDescriptionHard,
  hintsDescriptionSoft,
  hintsTitleHard,
  hintsTitleSoft,
} from '../config/hints';
import { EditBoundary } from './EditBoundary';
import { EditMultipleIndicators } from './EditMultipleIndicators';

interface AddIndicatorModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalData: unknown;
}

export default function AddIndicatorModal({
  isOpen,
  modalData,
  closeModal,
}: AddIndicatorModalProps) {
  const [boundary, setBoundary] = useState<number>(3);
  const [valueError, setValueError] = useState<string | undefined>();
  const [indicators, setIndicators] = useState<string[]>(['']);
  const { id, name, skillType } = modalData as Pick<
    Competency,
    'id' | 'name'
  > & { skillType: SkillType };

  const hintsTitle = skillType === 'HARD' ? hintsTitleHard : hintsTitleSoft;
  const hintsDescription =
    skillType === 'HARD' ? hintsDescriptionHard : hintsDescriptionSoft;

  const [hints, setHints] = useState<string[]>(
    Object.keys(hintsDescription).map(
      (key) => hintsDescription[Number(key) as keyof typeof hintsDescription],
    ),
  );
  const [values, setValues] = useState<string[]>(
    Object.keys(hintsTitle).map(
      (key) => hintsTitle[Number(key) as keyof typeof hintsTitle],
    ),
  );

  const [createIndicator, indicatorProps] =
    skillsApi.useCreateIndicatorMutation();

  const indicatorSubmit = (indicators: string[]) => {
    const filtered = indicators
      .map((indicator) => indicator.trim())
      .filter((indicator) => indicator !== '');
    if (!id) {
      return toast.error('Не выбрана компетеннция');
    }
    if (filtered.length === 0) {
      return setValueError('Введите хотя бы один индикатор');
    }
    createIndicator({
      indicators: filtered,
      competencyId: id,
      boundary,
      hints: Object.keys(hintsDescription).reduce((acc, key) => {
        // @ts-expect-error
        acc[key] = hints[key];
        return acc;
      }, {} as Hints),
      values: Object.keys(hintsTitle).reduce((acc, key) => {
        // @ts-expect-error
        acc[key] = values[key];
        return acc;
      }, {} as HintValues),
    });
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Новые индикаторы"
      onSubmit={() => indicatorSubmit(indicators)}
      submitText="Добавить"
      loading={indicatorProps.isLoading}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 mt-2">
          Компетенция: <span className="text-gray-900 ml-1">{name}</span>
        </p>
        <EditMultipleIndicators
          indicators={indicators}
          setIndicators={setIndicators}
          firstNotDeletable
        />
        {valueError && (
          <p className="text-red-500 text-sm mt-2">{valueError}</p>
        )}
        <div className="mt-4 flex flex-col gap-2">
          <EditBoundary boundary={boundary} setBoundary={setBoundary} />
          <EditHints
            hitnsData={hints}
            setHintsData={setHints}
            valuesData={values}
            setValuesData={setValues}
          />
        </div>
      </div>
    </Modal>
  );
}
