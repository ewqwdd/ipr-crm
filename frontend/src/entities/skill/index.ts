import type {
  CompetencyBlock,
  Competency,
  Indicator,
  SkillType,
  AddCompetencyBlockDto,
  AddCompetencyDto,
  AddIndicatorDto,
} from './types/types';
import AddCompetencyBlockModal from './ui/AddCompetencyBlockModal';
import AddCompetencyModal from './ui/AddCompetencyModal';
import AddIndicatorModal from './ui/AddIndicatorModal';
import AddBlockToSpecModal from './ui/AddBlockToSpecModal';
import useSkillsService from './hooks/useSkillsService';

export type {
  CompetencyBlock,
  Competency,
  Indicator,
  SkillType,
  AddCompetencyBlockDto,
  AddCompetencyDto,
  AddIndicatorDto,
};

export {
  AddCompetencyBlockModal,
  AddCompetencyModal,
  AddIndicatorModal,
  AddBlockToSpecModal,
  useSkillsService,
};
