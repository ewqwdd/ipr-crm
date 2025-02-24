import { cva } from '@/shared/lib/cva';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  percent: number;
}

export default function Progress({
  percent,
  className,
  ...props
}: ProgressProps) {
  return (
    <div
      className={cva(
        'rounded-xl relative overflow-clip h-2 bg-gray-200',
        className,
      )}
      {...props}
    >
      <figure
        className="bg-green-500 h-full left-0 top-0 transition-all duration-500"
        style={{
          width: `${percent * 100}%`,
        }}
      />
    </div>
  );
}
