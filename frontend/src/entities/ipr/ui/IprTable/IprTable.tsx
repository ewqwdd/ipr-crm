import { cva } from '@/shared/lib/cva';
import { Ipr } from '../../model/types';
import ColumnsHeading from './ColumnsHeading';
import RateRow from './RateRow';

interface IprTableProps {
  ipr: Ipr[];
  isLoading: boolean;
  selected?: number[];
  setSelected?: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function IprTable({
  ipr,
  isLoading,
  selected,
  setSelected,
}: IprTableProps) {
  return (
    <div className="max-sm:max-w-full max-sm:overflow-x-auto">
      <table className="sm:min-w-full divide-y divide-gray-300 mt-2">
        <ColumnsHeading />
        <tbody
          className={cva('bg-white', {
            'animate-pulse pointer-events-none': isLoading,
          })}
        >
          {ipr?.map((plan, index) => (
            <RateRow
              setSelected={setSelected}
              selected={selected}
              index={index}
              task={plan}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
