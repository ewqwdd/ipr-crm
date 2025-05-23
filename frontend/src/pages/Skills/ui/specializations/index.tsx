import { FC, useState } from 'react';
import SpecializationsTableWrapper from './SpecializationsTableWrapper';
import CompetencyBlock from './Competency';
import ArchiveButton from '../ArchiveButton';

const SpecializationsWrapper: FC = () => {
  const [selectedSpec, setSelectedSpec] = useState<number | null>(null);
  return (
    <>
      <ArchiveButton />
      <div className="sm:grid grid-cols-2 flex flex-col-reverse h-full sm:border-t border-gray-400 mt-20">
        <SpecializationsTableWrapper
          selectedSpec={selectedSpec}
          setSelectSpec={setSelectedSpec}
        />
        <CompetencyBlock selectedSpec={selectedSpec} />
      </div>
    </>
  );
};

export default SpecializationsWrapper;
