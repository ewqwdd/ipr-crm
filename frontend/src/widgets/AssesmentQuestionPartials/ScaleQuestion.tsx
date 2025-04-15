import { SurveyQuestion } from '@/entities/survey';
import { cva } from '@/shared/lib/cva';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';

interface ScaleQuestionProps {
  question: SurveyQuestion;
  answer: { scaleAnswer?: number };
  onChange: (value: number) => void;
}

export default function ScaleQuestion({
  question,
  answer,
  onChange,
}: ScaleQuestionProps) {
  return (
    <div className="flex flex-col gap-2 self-center min-w-56">
      <div className="flex gap-1">
        {new Array(question.scaleDots).fill(0).map((_, index) => (
          <SecondaryButton
            key={index}
            className={cva('size-10 p-0 transition-all text-xl', {
              'bg-indigo-600 text-white hover:bg-indigo-600':
                !!answer?.scaleAnswer && answer.scaleAnswer === index + 1,
            })}
            onClick={() => onChange(index + 1)}
          >
            {index + 1}
          </SecondaryButton>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{question.scaleStart}</span>
        <span className="text-sm text-gray-500">{question.scaleEnd}</span>
      </div>
    </div>
  );
}
