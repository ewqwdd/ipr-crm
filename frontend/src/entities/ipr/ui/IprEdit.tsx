import { Ipr } from '../model/types';
import Dimmer from '@/shared/ui/Dimmer';
import IprHeading from './partials/IprHeading';
import IprDetails from './partials/IprDetails';
import IprGoal from './partials/IprGoal';
import TasksSection from './partials/tasks';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app';
import { iprApi } from '@/shared/api/iprApi';

interface IprEditProps {
  ipr?: Ipr;
  loading: boolean;
}

export default function IprEdit({ ipr, loading }: IprEditProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      if (ipr) {
        dispatch(iprApi.util.invalidateTags([{ type: 'ipr', id: ipr.id }]));
      }
    };
  }, [dispatch, ipr]);

  return (
    <Dimmer active={loading}>
      <div className="px-8 py-10 flex flex-col gap-4">
        <IprHeading ipr={ipr} />
        <IprDetails ipr={ipr} />
        <IprGoal ipr={ipr} />
        <TasksSection
          tasks={ipr?.tasks}
          userId={ipr?.userId}
          planId={ipr?.id}
          skillType={ipr?.skillType}
        />
      </div>
    </Dimmer>
  );
}
