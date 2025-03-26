import { useAppDispatch, useAppSelector } from '@/app';
import DatePickerLight from '@/shared/ui/DatePickerLight';
import { DateObject } from 'react-multi-date-picker';
import { SoftButton } from '@/shared/ui/SoftButton';
import { testCreateActions } from '@/entities/test/testCreateSlice';

export default function EndDate() {
  const endDate = useAppSelector((state) => state.testCreate.endDate);
  const dispatch = useAppDispatch();

  const handleChange = (date?: DateObject | DateObject[]) => {
    if (Array.isArray(date)) {
      return;
    }
    dispatch(
      testCreateActions.setField({ field: 'endDate', value: date?.toDate() }),
    );
  };

  return (
    <div className="flex gap-2">
      <DatePickerLight
        label="Дата окончания"
        onChange={handleChange}
        value={endDate}
      />
      {endDate && (
        <SoftButton
          className="h-[38px] self-end"
          onClick={() =>
            dispatch(
              testCreateActions.setField({
                field: 'endDate',
                value: undefined,
              }),
            )
          }
        >
          Очистить
        </SoftButton>
      )}
    </div>
  );
}
