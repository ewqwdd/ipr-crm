import { Ipr } from '../model/types';
import IprHeading from './partials/IprHeading';
import IprDetails from './partials/IprDetails';
import TasksSection from './partials/tasks';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useModal } from '@/app/hooks/useModal';
interface IprEditProps {
  ipr?: Ipr;
}

export default function IprEdit({ ipr }: IprEditProps) {
  const { openModal } = useModal();

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-4">
      <IprHeading ipr={ipr} />
      <IprDetails ipr={ipr} />
      {/* <IprGoal ipr={ipr} edittable /> */}
      <TasksSection
        tasks={ipr?.tasks}
        userId={ipr?.userId}
        planId={ipr?.id}
        skillType={ipr?.skillType}
      />
      {!ipr?.rate360.meetDate && (
        <PrimaryButton
          className="mt-2 ml-auto block"
          onClick={() => openModal('END_MEETING', { rateId: ipr?.rate360Id })}
        >
          Звершить встречу
        </PrimaryButton>
      )}
    </div>
  );
}
