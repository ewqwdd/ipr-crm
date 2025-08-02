import type { Competency, SkillType } from "@/shared/types/Rate";
import AssesmentIndicator from "./AssesmentIndicator";
import { useAtomValue, useSetAtom } from "jotai";
import { rateProgressAtom } from "@/atoms/rateProgressAtom";
import {
  commentsProgressAtom,
  setCommentProgress,
} from "@/atoms/commentsProgressAtom";
import Textarea from "@/shared/ui/Textarea";
import { $api } from "@/shared/lib/$api";

interface AssesmentCompetencyProps {
  competency: Competency;
  skillType: SkillType;
  rateId: number;
}

export default function AssesmentCompetency({
  competency,
  skillType,
  rateId,
}: AssesmentCompetencyProps) {
  const userRates = useAtomValue(rateProgressAtom);
  const comments = useAtomValue(commentsProgressAtom);
  const setComment = useSetAtom(setCommentProgress);

  const foundComment = comments.find((c) => c.competencyId === competency.id);
  const comment = foundComment?.comment ?? "";

  const saveComment = () => {
    $api.post("/rate360/assesment/comment", {
      rateId,
      competencyId: competency.id,
      comment,
    });
  };

  return (
    <div className="flex flex-col gap-5 font-extrabold">
      <h2 className="text-lg max-lg:text-accent">{competency.name}</h2>
      {competency.indicators.map((indicator) => (
        <AssesmentIndicator
          activeId={userRates.find((r) => r.indicatorId === indicator.id)?.rate}
          skillType={skillType}
          key={indicator.id}
          indicator={indicator}
        />
      ))}
      <div className="flex flex-col gap-3">
        <h3>Комментарий (по желанию)</h3>
        <Textarea
          onBlur={saveComment}
          value={comment}
          onChange={(e) =>
            setComment({ competencyId: competency.id, comment: e.target.value })
          }
          placeholder="Комментарий..."
        />
      </div>
    </div>
  );
}
