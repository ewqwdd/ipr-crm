import {
  IprHeadingCurator,
  IprProgress,
  taskTypes,
  UserIprTasks,
} from '@/entities/ipr';
import IprDetails from '@/entities/ipr/ui/partials/IprDetails';
import IprGoal from '@/entities/ipr/ui/partials/IprGoal';
import { iprApi } from '@/shared/api/iprApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { Link, useParams } from 'react-router';

export default function IprUser() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = iprApi.useFindUserIprByIdQuery(
    parseInt(id ?? ''),
  );

  return (
    <LoadingOverlay active={isLoading}>
      <div className="sm:px-8 px-4 py-6 sm:py-10 flex flex-col gap-4">
        <div className="flex justify-between">
          <Heading
            title={`Индивидуальный план развития №${id}`}
            className="max-sm:px-4"
          />
          <Link to="/board">
            <SecondaryButton className="gap-2">
              Доска задач <ArrowRightIcon className="size-4" />
            </SecondaryButton>
          </Link>
        </div>
        <IprHeadingCurator ipr={data} />
        <IprDetails ipr={data} />
        <IprProgress ipr={data} />
        <IprGoal ipr={data} />
        {data &&
          taskTypes.map((type) => <UserIprTasks ipr={data} type={type} />)}
      </div>
    </LoadingOverlay>
  );
}
