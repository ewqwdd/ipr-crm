import { Rate } from '@/entities/rates';
import RateRow from './RateRow';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { cva } from '@/shared/lib/cva';
import ColumnsHeading from './ColumnsHeading';

interface RatesTableProps {
  data?: Rate[];
  isLoading: boolean;
  setSelected?: React.Dispatch<React.SetStateAction<number[]>>;
  selected: number[];
}

export default function RatesTable({
  data,
  isLoading,
  setSelected,
  selected,
}: RatesTableProps) {
  return (
    <LoadingOverlay active={isLoading}>
      <div className="overflow-x-auto">
        {data?.length !== 0 ? (
          <table className="min-w-full divide-y divide-gray-300 mt-1">
            <ColumnsHeading />
            <tbody
              className={cva('bg-white', {
                'animate-pulse pointer-events-none': isLoading,
              })}
            >
              {data?.map((rate, index) => (
                <RateRow
                  key={rate.id}
                  rate={rate}
                  index={index}
                  selected={selected.includes(rate.id)}
                  setSelected={setSelected}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="min-h-60 flex justify-center items-center">
            Нет данных
          </div>
        )}
      </div>
    </LoadingOverlay>
  );
}
