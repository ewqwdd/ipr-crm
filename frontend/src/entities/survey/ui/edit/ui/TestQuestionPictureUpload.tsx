import { CreateSurveyQuestion } from '@/entities/survey/types/types';
import { QuestionPictureUpload } from '@/widgets/QuestionPartials';

interface SurveyQuestionPictureUploadProps {
  onChange?: (index: number, string: string) => void;
  questions: CreateSurveyQuestion[];
  index: number;
}

export default function SurveyQuestionPictureUpload({
  onChange,
  index,
  questions,
}: SurveyQuestionPictureUploadProps) {
  const question = questions[index];
  const value = question.photoUrl;

  return (
    <QuestionPictureUpload
      onChange={(v: string) => onChange?.(index, v)}
      value={value}
    />
  );
}
