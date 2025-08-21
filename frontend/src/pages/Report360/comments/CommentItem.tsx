import { FC } from 'react';
type CommentItemProps = {
  comment?: string;
};

const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="flex flex-col py-5 border-b border-gray-300">
      <p className="text-gray-500 text-sm">{comment}</p>
    </div>
  );
};

export default CommentItem;
