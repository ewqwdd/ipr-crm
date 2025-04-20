import { Card } from '@/shared/ui/Card';
import { Ipr } from '../../model/types';
import { useEffect, useRef, useState } from 'react';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { PencilIcon, SaveIcon, XIcon } from '@heroicons/react/outline';
import { cva } from '@/shared/lib/cva';
import { $api } from '@/shared/lib/$api';
import toast from 'react-hot-toast';

interface IprGoalProps {
  ipr?: Ipr;
}

export default function IprGoal({ ipr }: IprGoalProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [focused, setFocused] = useState(false);
  const initial = useRef(ipr?.goal);
  const [value, setValue] = useState(ipr?.goal);

  useEffect(() => {
    initial.current = ipr?.goal;
    setValue(ipr?.goal);
  }, [ipr]);

  const onEdit = () => {
    setIsEdit(true);
    setValue(initial.current);
  };

  const onCancel = () => {
    setValue(initial.current);
    setIsEdit(false);
  };

  const onSave = () => {
    setIsEdit(false);
    const previous = initial.current;
    $api.post(`/ipr/360/${ipr?.rate360Id}/goal`, { goal: value }).catch(() => {
      toast.error('Не удалось обновить цель');
      setValue(previous);
    });
    initial.current = value;
  };

  return (
    <Card className="[&>div]:flex gap-2 [&>div]:items-end [&>div]:flex-row">
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-semibold mb-2 sm:mb-4">Цель: </h2>
        {isEdit ? (
          <div className="relative self-start">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите цель"
              className="p-0 focus:outline-none focus:ring-0 focus:border-none border-none"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <div
              className={cva(
                'absolute bottom-0 right-0 w-full h-px bg-gray-500 rounded-full',
                {
                  'bg-indigo-500 h-0.5': !!focused,
                },
              )}
            />
          </div>
        ) : (
          <p>{value}</p>
        )}
      </div>
      <div className="flex gap-2">
        {isEdit && (
          <PrimaryButton danger className="p-1" onClick={onCancel}>
            <XIcon className="size-5" />
          </PrimaryButton>
        )}
        <PrimaryButton className="p-1" onClick={isEdit ? onSave : onEdit}>
          {!isEdit ? (
            <PencilIcon className="size-5" />
          ) : (
            <SaveIcon className="size-5" />
          )}
        </PrimaryButton>
      </div>
    </Card>
  );
}
