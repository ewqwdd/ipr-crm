import { Heading } from '@/shared/ui/Heading';
import { Ipr } from '../../model/types';
import { Avatar } from '@/shared/ui/Avatar';
import { Link } from 'react-router';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { ArrowRightIcon } from '@heroicons/react/outline';

interface IprHeadingProps {
  ipr?: Ipr;
}

export default function IprHeading({ ipr }: IprHeadingProps) {
  return (
    <>
      <Heading title="Индивидуальный план развития" />
      <div className="pb-5 border-b border-gray-300 flex items-start sm:gap-4 gap-2 mt-3">
        <div className="flex gap-4 items-center">
          <Avatar
            src={ipr?.user.avatar}
            className="sm:size-12 size-10 rounded-md border-black/5 border"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="sm:text-lg text-base leading-6 font-medium text-gray-900">
            {ipr?.user.firstName} {ipr?.user.lastName}
          </h1>
          <p className="text-sm text-gray-600">{ipr?.user.username}</p>
        </div>

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
