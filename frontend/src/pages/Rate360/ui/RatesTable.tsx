import { cva } from '@/shared/lib/cva';
import ColumnsHeading from './ColumnsHeading';
import { Rate } from '@/entities/rates';
import RateRow from './RateRow';

interface RatesTableProps {
  data: Rate[];
  isLoading: boolean;
}

export default function RatesTable({ data, isLoading }: RatesTableProps) {
  return (
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
  );
}
