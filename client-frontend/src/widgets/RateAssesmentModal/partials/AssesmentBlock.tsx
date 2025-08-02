import type { CompetencyBlock, SkillType } from "@/shared/types/Rate";
import AssesmentCompetency from "./AssesmentCompetency";
import Divider from "@/shared/ui/Divider";

interface AssesmentBlockProps {
  block: CompetencyBlock;
  skillType: SkillType;
  rateId: number;
}

export default function AssesmentBlock({
  block,
  skillType,
  rateId,
}: AssesmentBlockProps) {
  return (
    <div>
      {block.competencies.map((competency, index) => (
        <>
          <AssesmentCompetency
            rateId={rateId}
            key={competency.id}
            competency={competency}
            skillType={skillType}
          />
          {index !== block.competencies.length - 1 && <Divider />}
        </>
      ))}
    </div>
  );
}
