import { FC, PropsWithChildren } from 'react';
import Loading from '../Loading';

type DimmerProps = PropsWithChildren<{ active: boolean }>;

const Dimmer: FC<DimmerProps> = ({ children, active }) => {
  return (
    <div className="relative grow width-full height-full">
      {children}
      {active && (
        <div className="absolute  inset-0 bg-gray-900/50 flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Dimmer;
