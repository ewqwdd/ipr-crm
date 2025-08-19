import { Heading } from '@/shared/ui/Heading';
import { Ipr } from '../../model/types';
import { Link } from 'react-router';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { UserRateHeader } from '@/widgets/UserRateHeader';
import { useAppSelector } from '@/app';
import AdminSetDeputy from './deputy/AdminSetDeputy';
import CuratorDeputy from './deputy/CuratorDeputy';
import { dateService } from '@/shared/lib/dateService';

interface IprHeadingProps {
  ipr?: Ipr;
}

export default function IprHeading({ ipr }: IprHeadingProps) {
  const user = useAppSelector((state) => state.user.user);

  return (
    <>
      <Heading title="Индивидуальный план развития" />
      <div className="pb-5 border-b border-gray-300 flex items-start sm:gap-4 gap-2 mt-3">
        <UserRateHeader rate={ipr?.rate360} />
        {user?.role.name === 'admin' ? (
          <AdminSetDeputy ipr={ipr} />
        ) : (
          <CuratorDeputy ipr={ipr} />
        )}

        <div className="flex items-center gap-4 ml-auto">
          {ipr?.rate360.meetDate && (
            <span className="text-gray-600 font-medium text-sm">
              Дата встречи: {dateService.formatDate(ipr?.rate360.meetDate)}
            </span>
          )}

          <Link to={`/board/${ipr?.user.id}`}>
            <SecondaryButton>
              Доска задач
              <ArrowRightIcon className="size-4 ml-2 max-sm:hidden" />
            </SecondaryButton>
          </Link>
        </div>
      </div>
    </>
  );
}
