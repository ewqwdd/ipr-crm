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
  HintValues,
} from './types/types';
import { CompetencyType } from './types/types';
import AddCompetencyBlockModal from './ui/AddCompetencyBlockModal';
import AddCompetencyModal from './ui/AddCompetencyModal';
import AddIndicatorModal from './ui/AddIndicatorModal';
import AddBlockToSpecModal from './ui/AddBlockToSpecModal';
import useSkillsService from './hooks/useSkillsService';
import EditSkillsModal from './ui/EditSkillsModal';
import SkillsSwitcher from './ui/SkillsSwitcher';
import {
  hintsTitleHard,
  hintsDescriptionHard,
  hintsDescriptionSoft,
  hintsTitleSoft,
} from './config/hints';

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
  HintValues,
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
  hintsTitleHard,
  hintsDescriptionHard,
  hintsDescriptionSoft,
  hintsTitleSoft,
};
