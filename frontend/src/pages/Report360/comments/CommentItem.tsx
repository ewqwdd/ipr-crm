import { TeamUser } from '@/entities/team';
import { generalService } from '@/shared/lib/generalService';
import { Avatar } from '@/shared/ui/Avatar';
import { FC } from 'react';
type CommentItemProps = {
  user?: { username: string; avatar?: string } | TeamUser;
  comment?: string;
};

const CommentItem: FC<CommentItemProps> = ({ user, comment }) => {
  if (!user) return null;
  return (
    <div className="grid gap-2 grid-cols-[auto_1fr] py-5 border-b border-gray-300">
      <Avatar src={generalService.transformFileUrl(user.avatar)} className="" />
      <span className="font-medium">{user.username}</span>
      <p className="text-gray-500 col-start-2">{comment}</p>
    </div>
  );
};

export default CommentItem;
