import { useAppDispatch } from '@/app';
import { ratesActions } from '@/entities/rates';
import AddRate from '@/entities/rates/ui/AddRate/AddRate';
import { rate360Api } from '@/shared/api/rate360Api';
import { Heading } from '@/shared/ui/Heading';
import { Modal } from '@/shared/ui/Modal';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useState } from 'react';
import Dimmer from '@/shared/ui/Dimmer';
import RatesTable from './ui/RatesTable';
import Settings from './ui/Settings';

export default function Rate360() {
  const { data, isLoading } = rate360Api.useGetRatesQuery();
  const [selected, setSelected] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpen(false);
    dispatch(ratesActions.clear());
  };

  return (
    <Dimmer active={isLoading}>
      <div className="px-8 py-10 flex flex-col h-full realtive">
        <div className="flex justify-between items-center">
          <Heading title="Командные отчёты" description="Список 360 оценок" />
          <PrimaryButton onClick={() => setOpen(true)} className="self-start">
            Добавить
          </PrimaryButton>
        </div>
        <RatesTable
          selected={selected}
          data={data}
          isLoading={isLoading}
          setSelected={setSelected}
        />
        <Settings selected={selected} setSelected={setSelected} />
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
    </Dimmer>
  );
}
