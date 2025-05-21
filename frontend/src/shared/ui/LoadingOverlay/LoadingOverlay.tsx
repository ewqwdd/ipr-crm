import { FC, PropsWithChildren, useMemo } from 'react';
import Loading from '../Loading';
import { cva } from '@/shared/lib/cva';

type LoadingOverlayProps = PropsWithChildren<{
  active: boolean;
  className?: string;
  fullScereen?: boolean;
}>;

const LoadingOverlay: FC<LoadingOverlayProps> = ({
  children,
  active,
  className,
  fullScereen = false,
}) => {
  const memoizedChildren = useMemo(() => children, [children]);

  if (!active) return <>{memoizedChildren}</>;

  return (
    <div
      className={cva('relative grow w-full h-full', className, {
        'pointer-events-none max-sm:overflow-y-hidden': active,
      })}
    >
      <div
        className={cva(
          'absolute flex justify-center items-center bg-white rounded-md z-10 w-full h-full',
          {
            'fixed right-0 top-0 w-no-sidebar': fullScereen,
          },
        )}
      >
        <Loading />
      </div>
      <div className="opacity-30">{memoizedChildren}</div>
    </div>
  );
};

export default LoadingOverlay;
