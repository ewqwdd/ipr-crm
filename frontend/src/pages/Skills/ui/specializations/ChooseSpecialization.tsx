import { Heading } from '@/shared/ui/Heading';
import { FC } from 'react';

const ChooseSpecialization: FC = () => {
  return (
    <div>
      <Heading
        title={`Выберите\n специализацию`}
        description={`Чтобы управлять блоками,\n компетенциями и индикаторами в ней`}
      />
    </div>
  );
};

export default ChooseSpecialization;
