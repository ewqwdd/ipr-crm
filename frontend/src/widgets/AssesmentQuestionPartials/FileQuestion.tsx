import { SurveyQuestion } from '@/entities/survey';
import { Question } from '@/entities/test';
import { UploadFile } from '@/shared/ui/UploadFile';
import { ChangeEvent } from 'react';

interface FileQuestionProps {
  question: Question | SurveyQuestion;
  answer: { fileAnswer?: File | true };
  onChange: (value?: File) => void;
  loading?: boolean;
}

export default function FileQuestion({ onChange, answer }: FileQuestionProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    } else {
      onChange(undefined);
    }
  };

  return <UploadFile onChange={handleChange} value={answer?.fileAnswer} />;
}
