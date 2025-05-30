import { Ipr } from '../model/types';
import IprHeading from './partials/IprHeading';
import IprDetails from './partials/IprDetails';
import IprGoal from './partials/IprGoal';
import TasksSection from './partials/tasks';
interface IprEditProps {
  ipr?: Ipr;
}

export default function IprEdit({ ipr }: IprEditProps) {
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-4">
      <IprHeading ipr={ipr} />
      <IprDetails ipr={ipr} />
      <IprGoal ipr={ipr} edittable />
      <TasksSection
        tasks={ipr?.tasks}
        userId={ipr?.userId}
        planId={ipr?.id}
        skillType={ipr?.skillType}
      />
    </div>
  );
}
