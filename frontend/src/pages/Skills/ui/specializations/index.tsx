import { FC, useState } from 'react';
import SpecializationsTableWrapper from './SpecializationsTableWrapper';
import CompetencyBlock from './Competency';
import ArchiveButton from '../ArchiveButton';
import { skillsApi } from '@/shared/api/skillsApi';
import { cva } from '@/shared/lib/cva';

interface SpecializationsWrapperProps {
  archiveMutation: ReturnType<typeof skillsApi.useArchiveAllMutation>;
}

const SpecializationsWrapper: FC<SpecializationsWrapperProps> = ({
  archiveMutation,
}) => {
  const [selectedSpec, setSelectedSpec] = useState<number | null>(null);

  return (
    <>
      <ArchiveButton archiveMutation={archiveMutation} />
      <div
        className={cva(
          'sm:grid grid-cols-2 flex flex-col-reverse h-full sm:border-t border-gray-400 mt-20',
          {
            'animate-pulse pointer-events-none': archiveMutation[1].isLoading,
          },
        )}
      >
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
