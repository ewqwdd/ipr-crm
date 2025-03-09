import { FC, ReactNode } from 'react';
import DatePicker, { DateObject, type Value } from 'react-multi-date-picker';

type DatePickerLightProps = {
  value?: Value | Value[];
  onChange: (date?: DateObject | DateObject[]) => void;
  required?: boolean;
  minDate?: Exclude<Value, null>;
  label?: string;
  placeholder?: string;
  range?: boolean;
  children?: ReactNode;
};

const DatePickerLight: FC<DatePickerLightProps> = ({
  value,
  onChange,
  required,
  minDate,
  label,
  placeholder,
  range,
  children,
}) => {
  const onChangeHandler = (date: DateObject | DateObject[] | null) => {
    if (date === null) {
      onChange(undefined);
    } else {
      onChange(date);
    }
  };

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
        placeholder={placeholder}
        containerClassName="w-full"
        inputClass={
          'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
        }
        onChange={onChangeHandler}
        required={required}
        minDate={minDate}
        range={range}
      >
        {children}
      </DatePicker>
    </div>
  );
};

export default DatePickerLight;
