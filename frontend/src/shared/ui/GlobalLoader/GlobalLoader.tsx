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
            'absolute top-0 right-0 w-full h-full bg-white flex justify-center items-center pointer-events-none',
          )}
        >
          <Loading />
        </div>
      )}
    </>
  );
};

export default GlobalLoader;
