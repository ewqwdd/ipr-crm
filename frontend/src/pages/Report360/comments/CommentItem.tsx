import { Avatar } from '@/shared/ui/Avatar';
import { FC } from 'react';
type CommentItemProps = {
  comment?: string;
};

const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="grid gap-4 grid-cols-[auto_1fr] py-5 border-b border-gray-300">
      <Avatar className="" />
      <p className="text-gray-500 col-start-2 text-sm">{comment}</p>
    </div>
  );
};

export default CommentItem;
