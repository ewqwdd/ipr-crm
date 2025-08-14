import { Modal } from '@/shared/ui/Modal';
import useSkillsService from '../hooks/useSkillsService';
import { CompetencyType, Hints, HintValues, SkillType } from '../types/types';
import { useState } from 'react';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import toast from 'react-hot-toast';
import { EditHints } from './EditHints';
import {
  hintsDescriptionHard,
  hintsDescriptionSoft,
  hintsTitleHard,
  hintsTitleSoft,
} from '../config/hints';
import { EditBoundary } from './EditBoundary';
import { Checkbox } from '@/shared/ui/Checkbox';

interface EditModalData {
  type: CompetencyType;
  id: number;
  name: string;
  boundary?: number;
  hints?: {
    skipHint?: string;
    hint1: string;
    hint2: string;
    hint3: string;
    hint4: string;
    hint5: string;
  };
  values?: {
    skipValue?: string;
    value1: string;
    value2: string;
    value3: string;
    value4: string;
    value5: string;
  };
  skillType: SkillType;
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
    skillType,
  } = modalData as EditModalData;
  const [value, setValue] = useState(name);
  const [boundary, setBoundary] = useState<number>(boundaryInit ?? 3);
  const [editCompetencyHints, setEditCompetencyHints] =
    useState<boolean>(false);

  const hintsDescription =
    skillType === 'HARD' ? hintsDescriptionHard : hintsDescriptionSoft;
  const hintsTitle = skillType === 'HARD' ? hintsTitleHard : hintsTitleSoft;

  const [hints, setHints] = useState<string[]>(
    Object.keys(hintsDescription).map((key) => {
      if (key === '0') {
        return hintsInit?.skipHint ?? hintsDescription[0];
      }
      return (
        hintsInit?.[`hint${key}` as keyof typeof hintsInit] ??
        hintsDescription[Number(key) as keyof typeof hintsDescription]
      );
    }),
  );

  const [hintValues, setHintValues] = useState<string[]>(
    Object.keys(hintsTitle).map((key) => {
      if (key === '0') {
        return valuesInit?.skipValue ?? hintsTitle[0];
      }
      return (
        valuesInit?.[`value${key}` as keyof typeof hintsInit] ??
        hintsTitle[Number(key) as keyof typeof hintsTitle]
      );
    }),
  );

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
          data.hints = Object.keys(hintsDescription).reduce((acc, key) => {
            // @ts-expect-error
            acc[key] = hints[key];
            return acc;
          }, {} as Hints);
          data.values = Object.keys(hintsTitle).reduce((acc, key) => {
            // @ts-expect-error
            acc[key] = hintValues[key];
            return acc;
          }, {} as HintValues);
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
          hints: Object.keys(hintsDescription).reduce((acc, key) => {
            // @ts-expect-error
            acc[key] = hints[key];
            return acc;
          }, {} as Hints),
          values: Object.keys(hintsTitle).reduce((acc, key) => {
            // @ts-expect-error
            acc[key] = hintValues[key];
            return acc;
          }, {} as HintValues),
        });
        break;
    }
    closeModal();
  };

  let title;
  switch (type) {
    case CompetencyType.COMPETENCY:
      title = 'Редактировать компетенцию';
      break;
    case CompetencyType.COMPETENCY_BLOCK:
      title = 'Редактировать блок компетенции';
      break;
    case CompetencyType.INDICATOR:
      title = 'Редактировать индикатор';
      break;
  }

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title={title}
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
            <EditBoundary
              skillType={skillType}
              boundary={boundary}
              setBoundary={setBoundary}
            />
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
