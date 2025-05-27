import { universalApi } from '@/shared/api/universalApi';
import { Autocomplete } from '@/shared/ui/Autocomplete';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { SoftButton } from '@/shared/ui/SoftButton';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/outline';
import { memo, useMemo } from 'react';

interface EditMultipleSpecsProps {
  specs: string[];
  setSpecs: React.Dispatch<React.SetStateAction<string[]>>;
}

export default memo(function EditMultipleSpecs({
  setSpecs,
  specs,
}: EditMultipleSpecsProps) {
  const { data, isLoading } = universalApi.useGetSpecsQuery();

  const specNames = useMemo(() => {
    return data?.map((spec) => spec.name) || [];
  }, [data]);

  return (
    <>
      <div className="flex flex-col gap-1">
        {specs.map((spec, index) => (
          <div className="flex gap-2 [&>div]:flex-1">
            <Autocomplete
              key={index}
              placeholder="Специализация"
              value={spec}
              options={specNames}
              loading={isLoading}
              onChange={(e) => {
                const newSpecs = [...specs];
                newSpecs[index] = e;
                setSpecs(newSpecs);
              }}
            />
            {index !== 0 && (
              <SoftButton
                danger
                className="rounded-full aspect-square size-[38px] p-0"
                onClick={() => {
                  const newSpecs = [...specs];
                  newSpecs.splice(index, 1);
                  setSpecs(newSpecs);
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
          setSpecs((prev) => [...prev, '']);
        }}
      >
        <PlusCircleIcon className="size-4 mr-2" />
        Добавить специализацию
      </SecondaryButton>
    </>
  );
});
