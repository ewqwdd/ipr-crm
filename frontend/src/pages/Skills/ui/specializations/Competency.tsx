import { FC } from 'react';
import ChooseSpecialization from './ChooseSpecialization';
interface ICompetencyProps {
  //
}

const CompetencyBlock: FC<ICompetencyProps> = (props) => {
  return (
    <div>
      <ChooseSpecialization />
    </div>
  );
};

export default CompetencyBlock;
