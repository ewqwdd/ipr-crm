import DatePickerLight from '@/shared/ui/DatePickerLight';
import { DateObject } from 'react-multi-date-picker';
import { SoftButton } from '@/shared/ui/SoftButton';

interface EndDateProps {
  onChange: (date?: DateObject | DateObject[]) => void;
  endDate?: Date;
  onClear: () => void;
}

export default function EndDate({ onChange, endDate, onClear }: EndDateProps) {
  return (
    <div className="flex gap-2">
      <DatePickerLight
        label="Дата окончания"
        onChange={onChange}
        value={endDate}
      />
      {endDate && (
        <SoftButton className="h-[38px] self-end" onClick={onClear}>
          Очистить
        </SoftButton>
      )}
    </div>
  );
}
