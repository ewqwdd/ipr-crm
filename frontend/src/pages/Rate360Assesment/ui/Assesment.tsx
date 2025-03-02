import { CompetencyBlock } from '@/entities/skill';
import { Assesment as AssesmentType } from '../types/types';
import Question from './Question';
import React from 'react';
import { TextArea } from '@/shared/ui/TextArea';

interface AssesmentProps {
  block: CompetencyBlock;
  assesment: AssesmentType;
  setAssesment: React.Dispatch<React.SetStateAction<AssesmentType>>;
  comments: Record<number, string | undefined>;
  setComments: React.Dispatch<
    React.SetStateAction<Record<number, string | undefined>>
  >;
}

export default function Assesment({
  block,
  assesment,
  setAssesment,
  comments,
  setComments,
}: AssesmentProps) {
  return (
    <div className="flex flex-col gap-6 px-8 flex-1 overflow-y-auto">
      {block.competencies
        .filter((c) => c.indicators.length > 0)
        .map((competency) => (
          <React.Fragment key={competency.id}>
            <h2 className="font-semibold mt-3">{competency.name}</h2>
            <div className="flex flex-col gap-4">
              {competency.indicators.map((indicator, index) => (
                <Question
                  indicator={indicator}
                  index={index}
                  key={indicator.id}
                  current={
                    assesment[block.id]?.[competency.id]?.[indicator.id] ?? {}
                  }
                  onChange={(rate, comment) =>
                    setAssesment((prev) => {
                      const newAssesment = { ...prev };
                      if (!newAssesment[block.id]) {
                        newAssesment[block.id] = {};
                      }
                      if (!newAssesment[block.id][competency.id]) {
                        newAssesment[block.id][competency.id] = {};
                      }
                      newAssesment[block.id][competency.id][indicator.id] = {
                        rate,
                        comment,
                      };
                      return newAssesment;
                    })
                  }
                />
              ))}

              <TextArea
                label="Комментарий (опционально)"
                value={comments[competency.id]}
                onChange={(e) =>
                  setComments({
                    ...comments,
                    [competency.id]: e.target.value || undefined,
                  })
                }
              />
            </div>
          </React.Fragment>
        ))}
    </div>
  );
}
