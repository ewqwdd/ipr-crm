import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { SoftButton } from '@/shared/ui/SoftButton';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/outline';
import { memo } from 'react';

interface EditMultipleIndicatorsProps {
  indicators: string[];
  setIndicators: React.Dispatch<React.SetStateAction<string[]>>;
  firstNotDeletable?: boolean;
}

export default memo(function EditMultipleIndicators({
  indicators,
  setIndicators,
  firstNotDeletable,
}: EditMultipleIndicatorsProps) {
  return (
    <>
      <div className="flex flex-col gap-1">
        {indicators.map((indicator, index) => (
          <div className="flex gap-2 [&>div]:flex-1">
            <InputWithLabelLight
              key={index}
              placeholder="Индикатор"
              value={indicator}
              onChange={(e) => {
                const newIndicators = [...indicators];
                newIndicators[index] = e.target.value;
                setIndicators(newIndicators);
              }}
            />
            {(index !== 0 || !firstNotDeletable) && (
              <SoftButton
                danger
                className="rounded-full aspect-square size-[38px] p-0"
                onClick={() => {
                  const newIndicators = [...indicators];
                  newIndicators.splice(index, 1);
                  setIndicators(newIndicators);
                }}
              >
                <TrashIcon className="h-5 w-5" />
              </SoftButton>
            )}
          </div>
        ))}
      </div>

      <SecondaryButton
        className="mt-1"
        onClick={() => {
          setIndicators((prev) => [...prev, '']);
        }}
      >
        <PlusCircleIcon className="size-4 mr-2" />
        Добавить индикатор
      </SecondaryButton>
    </>
  );
});
