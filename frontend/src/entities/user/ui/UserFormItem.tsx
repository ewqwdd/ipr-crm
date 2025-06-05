import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { User } from '../types/types';
import { generalService } from '@/shared/lib/generalService';

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
  let nameToShow = (user?.firstName ?? '') + ' ' + (user?.lastName ?? '');

  if (nameToShow === ' ') {
    nameToShow = user?.username ?? '';
  }

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
      <Avatar src={generalService.transformFileUrl(user?.avatar)} className="sm:size-8 size-4" />
      <span className="text-nowrap">{nameToShow}</span>
      {user?.Spec && (
        <Badge size="sm" color="blue" className="truncate">
          {user.Spec.name}
        </Badge>
      )}
    </label>
  );
}
