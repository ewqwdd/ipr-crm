import { EvaulatorType } from '@/shared/types/AssesmentBaseType';

interface ConfirmTitleProps {
  setAddType: (type: EvaulatorType) => void;
  type: EvaulatorType;
  title: string;
  blocked?: boolean;
}

export default function ConfirmTitle({
  setAddType,
  type,
  title,
  blocked,
}: ConfirmTitleProps) {
  return (
    <div className="flex justify-between border-b border-gray-300 pb-3">
      <h3 className="text-gray-700 font-semibold">{title}</h3>
      {!blocked && (
        <button
          className="text-violet-600 font-medium text-sm mr-1"
          onClick={() => setAddType(type)}
        >
          Добавить
        </button>
      )}
    </div>
  );
}
