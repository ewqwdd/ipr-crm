import ColumnsHeading from './ColumnsHeading';
import { Rate } from '@/entities/rates';
import RateRow from './RateRow';

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
    <div className="overflow-x-auto">
      {data?.length !== 0 ? (
        <table className="min-w-full divide-y divide-gray-300 mt-10">
          <ColumnsHeading />
          <tbody>
            {data?.map((rate, index) => (
              <RateRow
                key={rate.id}
                rate={rate}
                index={index}
                selected={selected.includes(rate.id)}
                setSelected={setSelected}
                isFetching={isLoading}
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
  );
}
