import { generalService } from '@/shared/lib/generalService';
import { Ipr } from '../../model/types';
import { Avatar } from '@/shared/ui/Avatar';
import { Link } from 'react-router';

interface IprHeadingCuratorProps {
  ipr?: Ipr;
}

export default function IprHeadingCurator({ ipr }: IprHeadingCuratorProps) {
  const user = ipr?.mentor ?? ipr?.rate360?.team?.curator;
  const avatar = generalService.transformFileUrl(user?.avatar);
  const title = user?.username;
  const subTitle = 'Куратор';

  return (
    <>
      <div className="pb-5 border-b border-gray-300 flex items-start sm:gap-4 gap-2 mt-3">
        <div className="flex gap-4 items-center">
          <Avatar
            src={avatar}
            className="sm:size-12 size-10 rounded-md border-black/5 border"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-gray-600">{subTitle}</p>
          <Link
            to={`/users/${user?.id}`}
            className="sm:text-lg text-base leading-6 font-medium text-gray-900"
          >
            {title}
          </Link>
        </div>
      </div>
    </>
  );
}
