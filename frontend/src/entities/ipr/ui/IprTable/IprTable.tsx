import { cva } from '@/shared/lib/cva';
import { Ipr } from '../../model/types';
import ColumnsHeading from './ColumnsHeading';
import RateRow from './RateRow';

interface IprTableProps {
  ipr: Ipr[];
  isLoading: boolean;
}

export default function IprTable({ ipr, isLoading }: IprTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-300 mt-10">
      <ColumnsHeading />
      <tbody
        className={cva('bg-white', {
          'animate-pulse pointer-events-none': isLoading,
        })}
      >
        {ipr?.map((plan, index) => <RateRow index={index} task={plan} />)}
      </tbody>
    </table>
  );
}
