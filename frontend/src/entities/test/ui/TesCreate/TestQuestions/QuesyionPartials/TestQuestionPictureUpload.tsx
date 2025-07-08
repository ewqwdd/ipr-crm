import { CreateQuestion } from '@/entities/test/types/types';
import { QuestionPictureUpload } from '@/widgets/QuestionPartials';

interface TestQuestionPictureUploadProps {
  onChange?: (index: number, string: string) => void;
  questions: CreateQuestion[];
  index: number;
}

export default function TestQuestionPictureUpload({
  onChange,
  index,
  questions,
}: TestQuestionPictureUploadProps) {
  const question = questions[index];
  const value = question.photoUrl;

  return (
    <QuestionPictureUpload
      onChange={(v: string) => onChange?.(index, v)}
      value={value}
    />
  );
}
