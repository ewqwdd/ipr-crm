import { CompetencyBlock, SkillType } from '@/entities/skill';
import { Assesment as AssesmentType } from '../types/types';
import Question from './Question';
import React, { useCallback, useRef } from 'react';
import { TextArea } from '@/shared/ui/TextArea';
import { $api } from '@/shared/lib/$api';
import debounce from 'lodash.debounce';

interface AssesmentProps {
  block: CompetencyBlock;
  assesment: AssesmentType;
  setAssesment: React.Dispatch<React.SetStateAction<AssesmentType>>;
  comments: Record<number, string | undefined>;
  setComments: React.Dispatch<
    React.SetStateAction<Record<number, string | undefined>>
  >;
  rateId: number;
  setLoading?: React.Dispatch<React.SetStateAction<number | undefined>>;
  skillType: SkillType;
  notAnswered?: number[];
  setNotAnswered?: React.Dispatch<React.SetStateAction<number[]>>;
  loading?: React.RefObject<number | undefined>;
}

interface DebouncedRateParams {
  rate?: number;
  rateId: number;
  indicatorId: number;
  onError: () => void;
  onFinally: () => void;
}

export default function Assesment({
  block,
  assesment,
  setAssesment,
  comments,
  setComments,
  rateId,
  setLoading,
  skillType,
  notAnswered = [],
  setNotAnswered = () => {},
  loading,
}: AssesmentProps) {
  const indicatorControllers = useRef<Record<number, AbortController>>({});

  // дебаунс + отмена предыдущего запроса
  const debouncedRate = useCallback(
    debounce((params: DebouncedRateParams) => {
      const { rate, rateId, indicatorId, onError, onFinally } = params;

      indicatorControllers.current[indicatorId]?.abort();
      const controller = new AbortController();
      indicatorControllers.current[indicatorId] = controller;

      $api
        .post(
          '/rate360/assesment/indicator',
          { rate, rateId, indicatorId },
          { signal: controller.signal },
        )
        .catch(onError)
        .finally(onFinally);
    }, 400),
    [],
  );

  return (
    <div className="flex flex-col gap-6 px-6 flex-1 overflow-y-auto overflow-x-clip pt-6">
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
                  skillType={skillType}
                  error={notAnswered.includes(indicator.id)}
                  current={
                    assesment[block.id]?.[competency.id]?.[indicator.id] ?? {}
                  }
                  onChange={(rate, comment) => {
                    setNotAnswered((prev) =>
                      prev.filter((id) => id !== indicator.id),
                    );
                    setAssesment((prev) => {
                      const newAssesment = { ...prev };
                      if (!newAssesment[block.id]) {
                        newAssesment[block.id] = {};
                      }
                      if (!newAssesment[block.id][competency.id]) {
                        newAssesment[block.id][competency.id] = {};
                      }
                      const prevValue =
                        newAssesment[block.id][competency.id][indicator.id];

                      if (
                        prevValue.rate === rate &&
                        prevValue.comment === comment
                      )
                        return prev;

                      setLoading?.((loading?.current ?? 0) + 1);
                      debouncedRate({
                        rate,
                        rateId,
                        indicatorId: indicator.id,
                        onError: () => {
                          setAssesment((prev) => {
                            const newAssesment = { ...prev };
                            if (!newAssesment[block.id]) {
                              newAssesment[block.id] = {};
                            }
                            if (!newAssesment[block.id][competency.id]) {
                              newAssesment[block.id][competency.id] = {};
                            }
                            newAssesment[block.id][competency.id][
                              indicator.id
                            ] = prevValue;
                            return newAssesment;
                          });
                        },
                        onFinally: () => {
                          setTimeout(
                            () =>
                              setLoading?.(
                                Math.max(0, (loading?.current ?? 0) - 1),
                              ),
                            50,
                          );
                        },
                      });

                      newAssesment[block.id][competency.id][indicator.id] = {
                        rate,
                        comment,
                      };
                      return newAssesment;
                    });
                  }}
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
                onBlur={() => {
                  if (!comments[competency.id]) return;
                  setLoading?.((loading?.current ?? 0) + 1);
                  $api
                    .post('/rate360/assesment/comment', {
                      rateId,
                      competencyId: competency.id,
                      comment: comments[competency.id],
                    })
                    .finally(() => {
                      setLoading?.((loading?.current ?? 0) - 1);
                    });
                }}
              />
            </div>
          </React.Fragment>
        ))}
    </div>
  );
}
