import { Heading } from '@/shared/ui/Heading';
import { Ipr } from '../../model/types';
import { Avatar } from '@/shared/ui/Avatar';

interface IprHeadingProps {
  ipr?: Ipr;
}

export default function IprHeading({ ipr }: IprHeadingProps) {
  return (
    <>
      <Heading title="Индивидуальный план развития" />
      <div className="pb-5 border-b border-gray-300 flex items-start gap-4 mt-3">
        <div className="flex gap-4">
          <Avatar
            src={ipr?.user.avatar}
            className="size-12 rounded-md border-black/5 border"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg leading-6 font-medium text-gray-900">
            {ipr?.user.firstName} {ipr?.user.lastName}
          </h1>
          <p className="text-sm text-gray-600">{ipr?.user.username}</p>
        </div>
      </div>
    </>
  );
}
