import { skillsApi } from '@/shared/api/skillsApi';

const useSkillsService = () => {
  const competencyBlockDelete = skillsApi.useDeleteCompetencyBlockMutation();
  const competencyDelete = skillsApi.useDeleteCompetencyMutation();
  const indicatorDelete = skillsApi.useDeleteIndicatorMutation();

  const addCompetencyBlock = skillsApi.useCreateCompetencyBlockMutation();
  const addCompetency = skillsApi.useCreateCompetencyMutation();
  const addIndicator = skillsApi.useCreateIndicatorMutation();

  const editCompetencyBlock = skillsApi.useEditCompetencyBlockMutation();
  const editCompetency = skillsApi.useEditCompetencyMutation();
  const editIndicator = skillsApi.useEditIndicatorMutation();

  return {
    competencyBlock: {
      delete: competencyBlockDelete,
      add: addCompetencyBlock,
      edit: editCompetencyBlock,
    },
    competency: {
      delete: competencyDelete,
      add: addCompetency,
      edit: editCompetency,
    },
    indicator: {
      delete: indicatorDelete,
      add: addIndicator,
      edit: editIndicator,
    },
  };
};

export default useSkillsService;
