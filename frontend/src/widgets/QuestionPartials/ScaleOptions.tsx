import { CreateSurveyQuestion } from '@/entities/survey';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';

interface ScaleOptionsProps {
  index: number;
  onScaleStartChange?: (index: number, value: string) => void;
  onScaleEndChange?: (index: number, value: string) => void;
  onScaleDotsChange?: (index: number, value: number) => void;
  questions: CreateSurveyQuestion[];
}

export default function ScaleOptions({
  index,
  questions,
  onScaleDotsChange,
  onScaleEndChange,
  onScaleStartChange,
}: ScaleOptionsProps) {
  const question = questions[index];
  const type = question.type;

  const scaleStart = question.scaleStart;
  const scaleEnd = question.scaleEnd;
  const scaleDots = question.scaleDots;

  const handleScaleDotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = Number(value);
    if (!isNaN(parsedValue) && parsedValue >= 1) {
      onScaleDotsChange?.(index, parsedValue);
    } else {
      onScaleDotsChange?.(index, 1);
    }
  };

  const handleScaleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onScaleStartChange?.(index, value);
  };

  const handleScaleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onScaleEndChange?.(index, value);
  };

  if (type !== 'SCALE') return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="grid grid-cols-3 gap-4 [&>div]:col-span-2">
        <span className="text-gray-800 font-medium">Количество точек</span>
        <InputWithLabelLight
          type="number"
          value={scaleDots}
          onChange={handleScaleDotsChange}
        />
        <span className="text-gray-800 font-medium">Начало шкалы</span>
        <InputWithLabelLight
          value={scaleStart}
          onChange={handleScaleStartChange}
        />
        <span className="text-gray-800 font-medium">Конец шкалы</span>
        <InputWithLabelLight value={scaleEnd} onChange={handleScaleEndChange} />
      </div>
    </div>
  );
}
