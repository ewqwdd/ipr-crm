import { Badge } from '@/shared/ui/Badge';
import { CustomCard, TaskPriority } from '@/entities/ipr';
import { BadgeProps } from '@/shared/ui/Badge/Badge';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TrashIcon } from '@heroicons/react/outline';
import { useModal } from '@/app/hooks/useModal';
import { priorityNames } from '../../model/constants';

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
    <div className="mt-4 bg-white p-4 rounded-md shadow-md flex flex-col gap-2 min-h-24 relative cursor-grab">
      <Badge
        color={priorityColors[card.priority]}
        className=" absolute top-2 right-2"
        size="sm"
      >
        {priorityNames[card.priority]}
      </Badge>
      <button
        className=" font-medium text-gray-800 cursor-pointer hover:text-indigo-600 transition-all self-start"
        onClick={onOpen}
      >
        {card.title}
      </button>
      <Badge
        className="rounded-full self-start px-2"
        size="sm"
        color={card.badgeColor}
      >
        {card.materialType}
      </Badge>
      <p className="text-sm text-gray-500 mt-1">{card.description}</p>
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
