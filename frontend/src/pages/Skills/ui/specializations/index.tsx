import { FC } from 'react';
import SpecializationsTableWrapper from './SpecializationsTableWrapper';
// import Competency from '../competency';
import CompetencyBlock from './Competency';

const SpecializationsWrapper: FC = () => {
  return (
    <div className="grid grid-cols-2 h-full border-t border-gray-400 mt-20">
      <SpecializationsTableWrapper />
      <CompetencyBlock />
    </div>
  );
};

export default SpecializationsWrapper;
