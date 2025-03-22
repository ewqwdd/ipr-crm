import { FC } from 'react';
import DatePickerLight from '@/shared/ui/DatePickerLight';
import { DateObject, Value } from 'react-multi-date-picker';
import { XIcon } from '@heroicons/react/outline';

interface PeriodSelectorProps {
  value?: Value | Value[];
  onChange: (date?: DateObject | DateObject[]) => void;
}

const PeriodSelector: FC<PeriodSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <DatePickerLight
        label="Период"
        placeholder="Выберите период"
        value={value}
        range={true}
        onChange={onChange}
      />
      {!!value && (
        <button
          className="absolute h-[36px] w-[36px] bottom-[1px] right-[0px] flex items-center justify-end"
          type="button"
          onClick={() => onChange()}
        >
          <XIcon className="h-6 w-6  rounded-full mr-2 bg-indigo-50 text-indigo-600" />
        </button>
      )}
    </div>
  );
};

export default PeriodSelector;
