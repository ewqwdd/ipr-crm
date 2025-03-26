import { TestOption } from '@/entities/test/types/types';
import { Card } from '@/shared/ui/Card';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TrashIcon } from '@heroicons/react/outline';
import { ReactNode } from 'react';

interface SingleOptionProps {
  option: TestOption;
  correctRequired: boolean;
  onDelete: () => void;
  radio: ReactNode;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function OptionBase({
  option,
  correctRequired,
  onDelete,
  radio,
  onNameChange,
}: SingleOptionProps) {
  return (
    <Card className="[&>div]:flex [&>div]:p-0 [&>div]:pt-0 [&>div]:items-center [&>div]:gap-4 bg-gray-100 border border-black/5 pr-2">
      <div className="flex-1 relative after:content-['.'] after:absolute after:w-[calc(100%-10px)] after:h-0.5 after:bottom-1.5 after:left-2.5 after:bg-gray-300 after:z-10">
        <InputWithLabelLight
          placeholder="Ответ"
          inputClassName="border-none shadow-none rounded-none focus:ring-transparent bg-gray-100"
          value={option.value}
          onChange={onNameChange}
        />
      </div>
      {correctRequired && radio}
      <SoftButton onClick={onDelete} danger className="p-1">
        <TrashIcon className="size-5" />
      </SoftButton>
    </Card>
  );
}
