import { FC, PropsWithChildren } from 'react';
import Loading from '../Loading';
import { cva } from '@/shared/lib/cva';

type DimmerProps = PropsWithChildren<{ active: boolean }>;

// хуйня навзание
const Dimmer: FC<DimmerProps> = ({ children, active }) => {
  return (
    <div
      className={cva('relative grow width-full height-full', {
        'pointer-events-none': active,
      })}
    >
      {children}
      {active && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Dimmer;
