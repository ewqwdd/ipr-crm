import { FC, ReactNode } from 'react';
import Loading from '../Loading';
import { cva } from '@/shared/lib/cva';
import { selectLoading } from '@/app/store/loadingSlice';
import { useSelector } from 'react-redux';

const GlobalLoader: FC<{ children: ReactNode }> = ({ children }) => {
  const loading = useSelector(selectLoading);
  return (
    <>
      {children}
      {loading && (
        <div
          className={cva(
            'fixed top-0 right-0 w-full  min-[1024px]:w-[calc(100%-min(24rem,33.3vw))] h-full bg-white flex justify-center items-center pointer-events-none z-10',
          )}
        >
          <Loading />
        </div>
      )}
    </>
  );
};

export default GlobalLoader;
