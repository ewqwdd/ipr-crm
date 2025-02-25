import { FC } from 'react';
import DatePicker from 'react-multi-date-picker';

type DatePickerLightProps = {
  value: Date;
  onChange: (date: Date) => void;
  required?: boolean;
  minDate?: Date;
  label?: string;
};

const DatePickerLight: FC<DatePickerLightProps> = ({
  value,
  onChange,
  required,
  minDate,
  label,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 font-bold ml-1">*</span>}
        </label>
      )}
      <DatePicker
        value={value}
        containerClassName="w-full"
        inputClass={
          'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
        }
        onChange={(date) => {
          if (date) {
            onChange(date.toDate());
          }
        }}
        required={required}
        minDate={minDate}
      />
    </div>
  );
};

export default DatePickerLight;
