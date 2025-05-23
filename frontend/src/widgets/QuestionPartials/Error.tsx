import { CreateSurveyQuestion } from '@/entities/survey';
import { CreateQuestion } from '@/entities/test/types/types';

interface ErrorProps {
  index: number;
  questions: CreateQuestion[] | CreateSurveyQuestion[];
}

export default function Error({ index, questions }: ErrorProps) {
  const error = questions[index].error;

  return error && <span className="font-medium text-red-500">{error}</span>;
}
