import { Badge } from '@/shared/ui/Badge';
import { CustomCard, TaskPriority } from '@/entities/ipr';
import { BadgeProps } from '@/shared/ui/Badge/Badge';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TrashIcon } from '@heroicons/react/outline';
import { useModal } from '@/app/hooks/useModal';
import { priorityNames } from '../../model/constants';
import { materialTypes } from '@/entities/material/model/types';
import MaterialIcon from '@/entities/material/ui/MaterialIcon';

interface BoardCardProps {
  card: CustomCard;
  deletable?: boolean;
  userId?: number;
}

const priorityColors: Record<TaskPriority, BadgeProps['color']> = {
  HIGH: 'red',
  MEDIUM: 'yellow',
  LOW: 'gray',
};

export default function BoardCard({ card, deletable, userId }: BoardCardProps) {
  const { openModal } = useModal();

  const onDelete = () => openModal('DELETE_TASK', { task: card.task });
  const onOpen = () => openModal('PREVIEW_TASK', { card: card, userId });

  return (
    <div className="mt-4 bg-white p-4 rounded-md shadow-md flex flex-col gap-2 min-h-24 relative cursor-grab pt-6">
      <Badge
        color={priorityColors[card.priority]}
        className=" absolute top-2 right-2"
        size="sm"
      >
        {priorityNames[card.priority]}
      </Badge>
      {card.task.deadline && (
        <span className="text-xs text-gray-500 -mb-2">
          {String(card.task.deadline).slice(0, 10)}
        </span>
      )}
      <button
        className="text-left font-medium text-gray-800 cursor-pointer hover:text-indigo-600 transition-all self-start line-clamp-3"
        onClick={onOpen}
      >
        {card.title}
      </button>
      <Badge
        className="rounded-full self-start px-2 flex gap-2"
        size="sm"
        color={card.badgeColor}
      >
        <MaterialIcon type={card.materialType} className="w-4 h-4" />
        {materialTypes[card.materialType]}
      </Badge>
      <p className="text-sm text-gray-500 mt-1 line-clamp-3">
        {card.description}
      </p>
      {deletable && (
        <SoftButton
          danger
          className="absolute bottom-2 right-2 rounded-full p-1"
          onClick={onDelete}
        >
          <TrashIcon className="w-5 h-5" />
        </SoftButton>
      )}
    </div>
  );
}
