import { Modal } from '@/shared/ui/Modal';
import useSkillsService from '../hooks/useSkillsService';
import { CompetencyType } from '../types/types';
import { useState } from 'react';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import toast from 'react-hot-toast';
import { EditHints } from './EditHints';
import { hintsDescription, hintsTitle } from '../config/hints';
import { EditBoundary } from './EditBoundary';
import { Checkbox } from '@/shared/ui/Checkbox';

interface EditModalData {
  type: CompetencyType;
  id: number;
  name: string;
  boundary?: number;
  hints?: {
    hint1: string;
    hint2: string;
    hint3: string;
    hint4: string;
    hint5: string;
  };
  values?: {
    value1: string;
    value2: string;
    value3: string;
    value4: string;
    value5: string;
  };
}

interface EditModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalData: unknown;
}

export default function EditSkillsModal({
  isOpen,
  closeModal,
  modalData,
}: EditModalProps) {
  const { competency, competencyBlock, indicator } = useSkillsService();
  const {
    id,
    name,
    type,
    boundary: boundaryInit,
    hints: hintsInit,
    values: valuesInit,
  } = modalData as EditModalData;
  const [value, setValue] = useState(name);
  const [boundary, setBoundary] = useState<number>(boundaryInit ?? 3);
  const [editCompetencyHints, setEditCompetencyHints] =
    useState<boolean>(false);

  const [hints, setHints] = useState<string[]>([
    hintsInit?.hint1 ?? hintsDescription[1],
    hintsInit?.hint2 ?? hintsDescription[2],
    hintsInit?.hint3 ?? hintsDescription[3],
    hintsInit?.hint4 ?? hintsDescription[4],
    hintsInit?.hint5 ?? hintsDescription[5],
  ]);

  const [hintValues, setHintValues] = useState<string[]>([
    valuesInit?.value1 ?? hintsTitle[1],
    valuesInit?.value2 ?? hintsTitle[2],
    valuesInit?.value3 ?? hintsTitle[3],
    valuesInit?.value4 ?? hintsTitle[4],
    valuesInit?.value5 ?? hintsTitle[5],
  ]);

  const editCompetency = competency.edit[0];
  const editCompetencyBlock = competencyBlock.edit[0];
  const editIndicator = indicator.edit[0];

  const loading =
    competency.edit[1].isLoading ||
    competencyBlock.edit[1].isLoading ||
    indicator.edit[1].isLoading;

  const onSubmit = () => {
    if (value.length === 0) return toast.error('Поле не может быть пустым');
    switch (type) {
      case CompetencyType.COMPETENCY: {
        const data: Parameters<typeof editCompetency>[0] = { id, name: value };
        if (editCompetencyHints) {
          data.boundary = boundary;
          data.hints = {
            1: hints[0],
            2: hints[1],
            3: hints[2],
            4: hints[3],
            5: hints[4],
          };
          data.values = {
            1: hintValues[0],
            2: hintValues[1],
            3: hintValues[2],
            4: hintValues[3],
            5: hintValues[4],
          };
        }
        editCompetency(data);
        break;
      }
      case CompetencyType.COMPETENCY_BLOCK:
        editCompetencyBlock({ id, name: value });
        break;
      case CompetencyType.INDICATOR:
        editIndicator({
          id,
          name: value,
          boundary,
          hints: {
            1: hints[0],
            2: hints[1],
            3: hints[2],
            4: hints[3],
            5: hints[4],
          },
          values: {
            1: hintValues[0],
            2: hintValues[1],
            3: hintValues[2],
            4: hintValues[3],
            5: hintValues[4],
          },
        });
        break;
    }
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Редактировать блок компетенции"
      onSubmit={onSubmit}
      submitText="Добавить"
      loading={loading}
    >
      <InputWithLabelLight
        label="Название"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {CompetencyType.COMPETENCY === type && (
        <Checkbox
          title="Редактировать подсказки"
          className="mt-4"
          checked={editCompetencyHints}
          onChange={() => setEditCompetencyHints((prev) => !prev)}
        />
      )}

      <div className="mt-4 flex flex-col gap-2">
        {(CompetencyType.INDICATOR === type ||
          (CompetencyType.COMPETENCY === type && editCompetencyHints)) && (
          <>
            <EditBoundary boundary={boundary} setBoundary={setBoundary} />
            <EditHints
              hitnsData={hints}
              setHintsData={setHints}
              valuesData={hintValues}
              setValuesData={setHintValues}
            />
          </>
        )}
      </div>
    </Modal>
  );
}
