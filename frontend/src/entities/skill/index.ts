import type {
  CompetencyBlock,
  Competency,
  Indicator,
  SkillType,
  AddCompetencyBlockDto,
  AddCompetencyDto,
  AddIndicatorDto,
  SkillCombineType,
  Version,
} from './types/types';
import { CompetencyType } from './types/types';
import AddCompetencyBlockModal from './ui/AddCompetencyBlockModal';
import AddCompetencyModal from './ui/AddCompetencyModal';
import AddIndicatorModal from './ui/AddIndicatorModal';
import AddBlockToSpecModal from './ui/AddBlockToSpecModal';
import useSkillsService from './hooks/useSkillsService';
import EditSkillsModal from './ui/EditSkillsModal';
import SkillsSwitcher from './ui/SkillsSwitcher';

export type {
  CompetencyBlock,
  Competency,
  Indicator,
  SkillType,
  AddCompetencyBlockDto,
  AddCompetencyDto,
  AddIndicatorDto,
  SkillCombineType,
  Version,
};

export {
  AddCompetencyBlockModal,
  AddCompetencyModal,
  AddIndicatorModal,
  AddBlockToSpecModal,
  useSkillsService,
  CompetencyType,
  EditSkillsModal,
  SkillsSwitcher,
};
