import { Ipr } from '../model/types';
import Dimmer from '@/shared/ui/Dimmer';
import IprHeading from './partials/IprHeading';
import IprDetails from './partials/IprDetails';
import IprGoal from './partials/IprGoal';
import Tasks from './partials/tasks';

interface IprEditProps {
  ipr?: Ipr;
  loading: boolean;
}

export default function IprEdit({ ipr, loading }: IprEditProps) {
  return (
    <Dimmer active={loading}>
      <div className="px-8 py-10 flex flex-col gap-4">
        <IprHeading ipr={ipr} />
        <IprDetails ipr={ipr} />
        <IprGoal ipr={ipr} />
        <Tasks tasks={ipr?.tasks} />
      </div>
    </Dimmer>
  );
}
