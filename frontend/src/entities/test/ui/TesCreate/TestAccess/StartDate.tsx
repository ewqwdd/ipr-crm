import DatePickerLight from '@/shared/ui/DatePickerLight';
import { memo } from 'react';
import { DateObject } from 'react-multi-date-picker';

interface StartDateProps {
  startDate?: Date;
  onChange: (date?: DateObject | DateObject[]) => void;
}

export default memo(function StartDate({
  onChange,
  startDate,
}: StartDateProps) {
  return (
    <DatePickerLight
      required
      label="Дата старта"
      onChange={onChange}
      value={startDate}
    />
  );
});
