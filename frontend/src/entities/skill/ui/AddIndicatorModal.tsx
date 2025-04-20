import { Modal } from '@/shared/ui/Modal';
import { Competency } from '../types/types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { skillsApi } from '@/shared/api/skillsApi';
import { EditHints } from './EditHints';
import { hintsDescription, hintsTitle } from '../config/hints';
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

  const [hints, setHints] = useState<string[]>([
    hintsDescription[1],
    hintsDescription[2],
    hintsDescription[3],
    hintsDescription[4],
    hintsDescription[5],
  ]);

  const [values, setValues] = useState<string[]>([
    hintsTitle[1],
    hintsTitle[2],
    hintsTitle[3],
    hintsTitle[4],
    hintsTitle[5],
  ]);

  const [createIndicator, indicatorProps] =
    skillsApi.useCreateIndicatorMutation();

  const { id, name } = modalData as Pick<Competency, 'id' | 'name'>;

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
      hints: {
        1: hints[0],
        2: hints[1],
        3: hints[2],
        4: hints[3],
        5: hints[4],
      },
      values: {
        1: values[0],
        2: values[1],
        3: values[2],
        4: values[3],
        5: values[4],
      },
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
