import { useAppDispatch } from '@/app';
import { ratesActions } from '@/entities/rates';
import AddRate from '@/entities/rates/ui/AddRate/AddRate';
import { rate360Api } from '@/shared/api/rate360Api';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import { Modal } from '@/shared/ui/Modal';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useState } from 'react';
import ColumnsHeading from './ui/ColumnsHeading';
import RateRow from './ui/RateRow';

export default function Rate360() {
  const { data, isLoading } = rate360Api.useGetRatesQuery();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpen(false);
    dispatch(ratesActions.clear());
  };

  return (
    <>
      <div className="px-8 py-10 flex flex-col">
        <div className="flex justify-between items-center">
          <Heading title="Командные отчёты" description="Список 360 оценок" />
          <PrimaryButton onClick={() => setOpen(true)} className="self-start">
            Добавить
          </PrimaryButton>
        </div>
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
      </div>
      <Modal
        open={open}
        setOpen={handleClose}
        title="Добавить 360 оценку"
        className="sm:max-w-7xl mx-3"
        footer={false}
      >
        <AddRate closeModal={handleClose} />
      </Modal>
    </>
  );
}
