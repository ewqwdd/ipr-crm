import { FC, useState } from 'react';
import SpecializationsTableWrapper from './SpecializationsTableWrapper';
// import Competency from '../competency';
import CompetencyBlock from './Competency';
// import { Spec } from '@/entities/user';

const SpecializationsWrapper: FC = () => {
  const [selectedSpec, setSelectedSpec] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-2 h-full border-t border-gray-400 mt-20">
      <SpecializationsTableWrapper
        selectedSpec={selectedSpec}
        setSelectSpec={setSelectedSpec}
      />
      <CompetencyBlock selectedSpec={selectedSpec} />
    </div>
  );
};

export default SpecializationsWrapper;
