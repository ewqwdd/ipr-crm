import { Survey } from '@/entities/survey';
import OptionsResult from './OptionsResult';
import { cva } from '@/shared/lib/cva';
import { SurveyQuestionType } from '@/entities/survey/types/types';
import TextValueResult from './TextValueResult';
import { universalSort } from '@/shared/lib/universalSort';
import FileResult from './FileResult';
import ScaleResult from './ScaleResult';
import { dateService } from '@/shared/lib/dateService';

type Question = Survey['surveyQuestions'][number];

interface SurveyResultQuestionProps {
  question: Question;
  index: number;
}

const typeToFieldMap: Partial<
  Record<
    SurveyQuestionType,
    (question: Question['answeredQuestions'][number]) => string | undefined
  >
> = {
  NUMBER: (question) => question.numberAnswer?.toString(),
  TEXT: (question) => question.textAnswer,
  DATE: (question) =>
    question.dateAnswer
      ? dateService.formatDate(question.dateAnswer)
      : undefined,
  TIME: (question) => question.timeAnswer,
  PHONE: (question) => question.phoneAnswer,
};

export default function SurveyResultQuestion({
  question,
  index,
}: SurveyResultQuestionProps) {
  const totalAnswers = question.answeredQuestions.length;

  return (
    <div
      className={cva('flex flex-col py-10 px-8 border-b border-b-gray-200', {
        'bg-gray-50': index % 2 !== 0,
      })}
    >
      <h4 className="font-medium mb-4 max-w-md">
        {index + 1}. {question.label}
      </h4>

      {['MULTIPLE', 'SINGLE'].includes(question.type) && (
        <OptionsResult totalAnswers={totalAnswers} question={question} />
      )}

      {Object.keys(typeToFieldMap).includes(question.type) && (
        <TextValueResult
          values={question.answeredQuestions
            .map((q) => typeToFieldMap[question.type]?.(q))
            .filter((v): v is string => !!v)
            .sort((a, b) => universalSort(a, b, 'desc'))}
        />
      )}

      {question.type === 'FILE' && <FileResult question={question} />}

      {question.type === 'SCALE' && (
        <ScaleResult
          scaleDots={question.scaleDots || 1}
          values={question.answeredQuestions.map((q) => q.scaleAnswer ?? 0)}
        />
      )}

      <p className="text-sm text-gray-700 mt-4">
        Всего ответов: <span className="text-gray-500">{totalAnswers}</span>
      </p>
    </div>
  );
}
