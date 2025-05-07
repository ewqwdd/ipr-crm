import { FC, PropsWithChildren, useMemo } from 'react';
import Loading from '../Loading';
import { cva } from '@/shared/lib/cva';

type LoadingOverlayProps = PropsWithChildren<{
  active: boolean;
  className?: string;
}>;

const LoadingOverlay: FC<LoadingOverlayProps> = ({
  children,
  active,
  className,
}) => {
  // ✅ мемоизируем детей, чтобы React не триггерил ререндер без причины
  const memoizedChildren = useMemo(() => children, [children]);

  if (!active) return <>{memoizedChildren}</>;

  return (
    <div
      className={cva('relative grow w-full h-full', className, {
        'pointer-events-none max-sm:overflow-y-hidden': active,
      })}
    >
      <div className="absolute inset-0 flex justify-center items-center bg-white rounded-md h-full z-10">
        <Loading />
      </div>
      <div className="opacity-30">{memoizedChildren}</div>
    </div>
  );
};

export default LoadingOverlay;
