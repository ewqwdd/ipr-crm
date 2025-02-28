import { cva } from '@/shared/lib/cva';
import ColumnsHeading from './ColumnsHeading';
import { Rate } from '@/entities/rates';
import RateRow from './RateRow';
import Dimmer from '@/shared/ui/Dimmer';

interface RatesTableProps {
  data?: Rate[];
  isLoading: boolean;
}

export default function RatesTable({ data, isLoading }: RatesTableProps) {
  return (
    <Dimmer active={isLoading}>
      <div className="overflow-x-auto">
        {data?.length !== 0 ? (
          <table className="min-w-full divide-y divide-gray-300 mt-10">
            <ColumnsHeading />
            <tbody
              className={cva('bg-white', {
                'animate-pulse pointer-events-none': isLoading,
              })}
            >
              {data?.map((rate, index) => (
                <RateRow key={rate.id} rate={rate} index={index} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="min-h-60 flex justify-center items-center">
            Нет данных
          </div>
        )}
      </div>
    </Dimmer>
  );
}
