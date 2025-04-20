import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { User } from '../types/types';

interface UserFormItemProps {
  user?: User;
  selected: number[];
  setSelected: (selected: number[]) => void;
}

export default function UserFormItem({
  selected,
  setSelected,
  user,
}: UserFormItemProps) {
  return (
    <label className="flex gap-4 items-center">
      <input
        type="checkbox"
        checked={selected.includes(user?.id ?? -1)}
        onChange={() => {
          if (selected.includes(user?.id ?? -1)) {
            setSelected(selected.filter((id) => id !== user?.id));
          } else {
            setSelected([...selected, user?.id ?? -1]);
          }
        }}
      />
      <Avatar src={user?.avatar} className="sm:size-8 size-4" />
      <span className="text-nowrap">
        {user?.firstName} {user?.lastName}
      </span>
      {user?.Spec && (
        <Badge size="sm" color="blue" className="truncate">
          {user.Spec.name}
        </Badge>
      )}
    </label>
  );
}
