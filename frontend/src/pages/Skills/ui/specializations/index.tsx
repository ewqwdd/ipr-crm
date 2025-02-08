import { FC } from 'react';
import SpecializationsTable from './SpecializationsTable';
// import Competency from '../competency';
import CompetencyBlock from './Competency';

const SpecializationsWrapper: FC = () => {
  return (
    <div className="grid grid-cols-2">
      {/* <div></div> */}
      <SpecializationsTable />
      {/* < */}
      <CompetencyBlock />
    </div>
  );
};

export default SpecializationsWrapper;
