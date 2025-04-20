import { FC, PropsWithChildren } from 'react';
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
  return (
    <div
      className={cva('relative grow w-full h-full', className, {
        'pointer-events-none max-sm:overflow-y-hidden': active,
      })}
    >
      {children}
      {active && (
        <div className="absolute inset-0 flex justify-center items-center bg-white rounded-md h-full">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
