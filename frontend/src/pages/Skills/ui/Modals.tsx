import {
  AddCompetencyBlockModal,
  AddCompetencyModal,
  AddIndicatorModal,
  Competency,
  CompetencyBlock,
  SkillType,
} from '@/entities/skill';
import { skillsApi } from '@/shared/api/skillsApi';
import { ModalType } from './Skills';
import toast from 'react-hot-toast';

interface ModalsProps {
  skillType: SkillType;
  setCurrent: React.Dispatch<React.SetStateAction<ModalType | null>>;
  current: ModalType | null;
  competencyBlock?: CompetencyBlock;
  competency?: Competency;
}

export default function Modals({
  skillType,
  current,
  setCurrent,
  competencyBlock,
  competency,
}: ModalsProps) {
  const [createCompetencyBlock, blockProps] =
    skillsApi.useCreateCompetencyBlockMutation();
  const [createCompetency, comppetencyProps] =
    skillsApi.useCreateCompetencyMutation();
  const [createIndicator, indicatorProps] =
    skillsApi.useCreateIndicatorMutation();

  const setOpen = (open: boolean) => {
    if (!open) {
      setCurrent(null);
    }
  };

  const blockSubmit = (name: string) => {
    createCompetencyBlock({ name, type: skillType });
    setOpen(false);
  };

  const competencySubmit = (name: string) => {
    if (!competencyBlock) {
      return toast.error('Не выбран блок компетенций');
    }
    createCompetency({ name, blockId: competencyBlock.id });
    setOpen(false);
  };

  const indicatorSubmit = (name: string) => {
    if (!competency) {
      return toast.error('Не выбрана компетеннция');
    }
    createIndicator({ name, competencyId: competency.id });
    setOpen(false);
  };

  return (
    <>
      <AddCompetencyBlockModal
        open={current === 'ADD_COMPETENCY_BLOCK'}
        setOpen={setOpen}
        skillType={skillType}
        onSubmit={blockSubmit}
        loading={blockProps.isLoading}
      />
      <AddCompetencyModal
        open={current === 'ADD_COMPETENCY'}
        setOpen={setOpen}
        onSubmit={competencySubmit}
        loading={comppetencyProps.isLoading}
        competencyBlock={competencyBlock}
      />
      <AddIndicatorModal
        open={current === 'ADD_INDICATOR'}
        setOpen={setOpen}
        onSubmit={indicatorSubmit}
        loading={indicatorProps.isLoading}
        competency={competency}
      />
    </>
  );
}
