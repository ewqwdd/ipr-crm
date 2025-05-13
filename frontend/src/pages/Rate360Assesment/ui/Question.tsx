import {
  hintsTitleHard,
  hintsTitleSoft,
  hintsDescriptionHard,
  hintsDescriptionSoft,
  Indicator,
  SkillType,
} from '@/entities/skill';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { cva } from '@/shared/lib/cva';
import Tooltip from '@/shared/ui/Tooltip';
import { useMinMediaQuery } from '@/shared/hooks/useMediaQuery';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

interface QuestionProps {
  indicator: Indicator;
  index: number;
  onChange: (rate?: number, comment?: string) => void;
  current: { comment?: string; rate?: number };
  skillType: SkillType;
  error?: boolean;
}

export default function Question({
  indicator,
  index,
  onChange,
  current,
  skillType,
  error,
}: QuestionProps) {
  const { rate, comment } = current;

  const rateDescriptions =
    skillType === 'HARD' ? hintsDescriptionHard : hintsDescriptionSoft;
  const hintsTitle = skillType === 'HARD' ? hintsTitleHard : hintsTitleSoft;

  const moreThan1024 = useMinMediaQuery(1024);
  const moreThan520 = useMinMediaQuery(520);

  const descriptions = {
    1: indicator.hint1 ?? rateDescriptions[1],
    2: indicator.hint2 ?? rateDescriptions[2],
    3: indicator.hint3 ?? rateDescriptions[3],
    4: indicator.hint4 ?? rateDescriptions[4],
    ...(skillType === 'SOFT'
      ? // @ts-expect-error
        { 5: indicator.hint5 ?? rateDescriptions[5] }
      : {}),
  };

  const titles = {
    1: indicator.value1 ?? hintsTitle[1],
    2: indicator.value2 ?? hintsTitle[2],
    3: indicator.value3 ?? hintsTitle[3],
    4: indicator.value4 ?? hintsTitle[4],
    // @ts-expect-error
    ...(skillType === 'SOFT' ? { 5: indicator.value5 ?? hintsTitle[5] } : {}),
  };

  const skipAlign = () => {
    if (moreThan1024) return 'right';
    if (moreThan520 && skillType === 'SOFT') return 'right';
    if (moreThan520) return 'left';
    return 'center';
  };

  const skip = (
    <Tooltip
      align={skipAlign()}
      content={indicator.skipHint ?? rateDescriptions[0]}
    >
      <SecondaryButton
        onClick={() => onChange(0, comment)}
        className={cva('size-full', {
          'bg-green-100 hover:bg-green-100': rate === 0,
        })}
      >
        {indicator.skipValue ?? hintsTitle[0]}
      </SecondaryButton>
    </Tooltip>
  );

  const tooltipAllign = (value: number) => {
    if (moreThan1024) {
      const keys = Object.keys(descriptions);
      const index = keys.indexOf(value.toString());
      if (index === 0) return 'left';
      // if (index === keys.length - 1) return 'right';
      return 'center';
    }
    if (moreThan520) {
      if (value % 2 === 0) return 'right';
      return 'left';
    }
    return 'center';
  };

  return (
    <div className="flex gap-2 flex-col">
      <div
        className={cva(
          'flex gap-2 sm:items-center max-sm:flex-col text-gray-800',
        )}
      >
        <p className="font-medium flex-1">
          {index + 1}. {indicator.name}
        </p>
        {error && <ExclamationCircleIcon className="size-6 text-red-500" />}
      </div>

      <div
        className={cva(
          'lg:grid-cols-6 grid grid-cols-2 max-[520px]:grid-cols-1 gap-2',
          {
            'lg:grid-cols-5': skillType === 'HARD',
          },
        )}
      >
        {Object.entries(descriptions).map(([value, description]) => (
          <Tooltip
            content={description}
            key={value}
            align={tooltipAllign(+value)}
          >
            <SecondaryButton
              onClick={() => onChange(+value, comment)}
              className={cva('size-full', {
                'bg-green-100 hover:bg-green-100': +value === rate,
              })}
            >
              {/* @ts-expect-error */}
              {titles[value as unknown as keyof typeof hintsTitle]}
            </SecondaryButton>
          </Tooltip>
        ))}
        {skip}
      </div>
    </div>
  );
}
