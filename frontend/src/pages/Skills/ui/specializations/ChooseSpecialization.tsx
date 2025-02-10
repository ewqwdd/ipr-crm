import { ArrowLeftIcon } from '@heroicons/react/outline';
import { FC } from 'react';

const ChooseSpecialization: FC = () => {
  return (
    <div className="pt-5 max-w-[320px] mx-auto text-center">
      <ArrowLeftIcon className="w-10 h-10 mb-4 mx-auto" />
      <h2 className="text-lg font-bold mb-2">
        Выберите
        <br />
        специализацию
      </h2>
      <p className="">
        Чтобы управлять блоками,
        <br /> компетенциями и индикаторами в ней
      </p>
    </div>
  );
};

export default ChooseSpecialization;
