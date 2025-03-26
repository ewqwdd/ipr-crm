import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import DatePickerLight from '@/shared/ui/DatePickerLight';
import { DateObject } from 'react-multi-date-picker';

export default function StartDate() {
  const startDate = useAppSelector((state) => state.testCreate.startDate);
  const dispatch = useAppDispatch();

  const handleChange = (date?: DateObject | DateObject[]) => {
    if (Array.isArray(date)) {
      return;
    }
    dispatch(
      testCreateActions.setField({ field: 'startDate', value: date?.toDate() }),
    );
  };

  return (
    <DatePickerLight
      required
      label="Дата старта"
      onChange={handleChange}
      value={startDate}
    />
  );
}
