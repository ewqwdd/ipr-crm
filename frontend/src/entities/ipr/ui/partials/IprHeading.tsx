import { Heading } from '@/shared/ui/Heading';
import { Ipr } from '../../model/types';
import { Link } from 'react-router';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { UserRateHeader } from '@/widgets/UserRateHeader';

interface IprHeadingProps {
  ipr?: Ipr;
}

export default function IprHeading({ ipr }: IprHeadingProps) {
  return (
    <>
      <Heading title="Индивидуальный план развития" />
      <div className="pb-5 border-b border-gray-300 flex items-start sm:gap-4 gap-2 mt-3">
        <UserRateHeader rate={ipr?.rate360} />

        <Link to={`/board/${ipr?.user.id}`} className="ml-auto">
          <SecondaryButton>
            Доска задач
            <ArrowRightIcon className="size-4 ml-2 max-sm:hidden" />
          </SecondaryButton>
        </Link>
      </div>
    </>
  );
}
