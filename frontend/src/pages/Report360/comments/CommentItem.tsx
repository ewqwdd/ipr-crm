import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { generalService } from '@/shared/lib/generalService';
import { Avatar } from '@/shared/ui/Avatar';
import { FC } from 'react';
type CommentItemProps = {
  comment?: string;
  user?: {
    username: string;
    avatar?: string;
  };
};

const CommentItem: FC<CommentItemProps> = ({ comment, user }) => {
  const isAdmin = useIsAdmin();

  return (
    <div className="grid gap-4 grid-cols-[auto_1fr] py-5 border-b border-gray-300">
      <Avatar
        className=""
        src={
          isAdmin ? generalService.transformFileUrl(user?.avatar) : undefined
        }
      />
      <div className="flex flex-col col-start-2">
        {isAdmin && user && <p className="text-gray-900">{user.username}</p>}
        <p className="text-gray-500 text-sm">{comment}</p>
      </div>
    </div>
  );
};

export default CommentItem;
