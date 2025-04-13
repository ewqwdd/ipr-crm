import { DateObject } from 'react-multi-date-picker';
import Access from './Access';
import Anonymous from './Anonymous';
import EndDate from './EndDate';
import StartDate from './StartDate';

interface TestAccessProps {
  access: string;
  onChangeAccess: (access: string) => void;
  anonymous: boolean;
  onChangeAnonymous: (anonymous: string) => void;
  startDate?: Date;
  onChangeStartDate: (date?: DateObject | DateObject[]) => void;
  endDate?: Date;
  onChangeEndDate: (date?: DateObject | DateObject[]) => void;
  onClearEndDate: () => void;
}

export default function TestAccess({
  access,
  onChangeAccess,
  anonymous,
  onChangeAnonymous,
  onChangeStartDate,
  startDate,
  onChangeEndDate,
  onClearEndDate,
  endDate,
}: TestAccessProps) {
  return (
    <div className="flex flex-col gap-8 mt-6 max-w-4xl">
      <div className="flex gap-8">
        <StartDate onChange={onChangeStartDate} startDate={startDate} />
        <EndDate
          onChange={onChangeEndDate}
          onClear={onClearEndDate}
          endDate={endDate}
        />
      </div>
      <Access access={access ?? 'PRIVATE'} onChange={onChangeAccess} />
      <Anonymous anonymous={anonymous} onChangeAnonymous={onChangeAnonymous} />
    </div>
  );
}
