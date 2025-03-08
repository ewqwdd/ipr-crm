import { Indicator } from '@/entities/skill';
import { rateDescriptions } from '@/entities/rates';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { cva } from '@/shared/lib/cva';

interface QuestionProps {
  indicator: Indicator;
  index: number;
  onChange: (rate?: number, comment?: string) => void;
  current: { comment?: string; rate?: number };
}

export default function Question({
  indicator,
  index,
  onChange,
  current,
}: QuestionProps) {
  const { rate, comment } = current;

  const descriptions = {
    1: indicator.hint1 ?? rateDescriptions[1],
    2: indicator.hint2 ?? rateDescriptions[2],
    3: indicator.hint3 ?? rateDescriptions[3],
    4: indicator.hint4 ?? rateDescriptions[4],
    5: indicator.hint5 ?? rateDescriptions[5],
  };

  return (
    <div className="flex gap-2 flex-col">
      <p className="text-gray-800 font-medium">
        {index + 1}. {indicator.name}
      </p>

      <div className="lg:grid-cols-5 grid grid-cols-2 max-[520px]:grid-cols-1 gap-2">
        {Object.entries(descriptions).map(([value, description]) => (
          <SecondaryButton
            key={value}
            onClick={() => onChange(+value, comment)}
            className={cva({
              'bg-green-100 hover:bg-green-100': +value === rate,
            })}
          >
            {description}
          </SecondaryButton>
        ))}
      </div>
    </div>
  );
}
