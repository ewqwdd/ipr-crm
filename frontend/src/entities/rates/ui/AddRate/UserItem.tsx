import { TeamUser } from '@/entities/team';
import { universalApi } from '@/shared/api/universalApi';
import { Avatar } from '@/shared/ui/Avatar';
import { Checkbox } from '@/shared/ui/Checkbox';
import { AddRateDto } from '../../types/types';

interface UserItemProps {
  user: TeamUser;
  selected?: AddRateDto['specs'];
  onChange?: (teamId: number, specId: number, userId: number) => void;
  teamId: number;
}

export default function UserItem({
  user,
  selected,
  onChange,
  teamId,
}: UserItemProps) {
  const { data } = universalApi.useGetSpecsQuery();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar src={user.avatar} />
        <span>{user.username}</span>
      </div>
      {user.specsOnTeams?.length > 0 ? (
        <div className="flex flex-col pl-2 bg-violet-50 pt-2 pb-3">
          {user.specsOnTeams?.map((spec) => (
            <Checkbox
              key={spec.specId}
              title={data?.find((s) => s.id === spec.specId)?.name}
              className="[&_label]:text-base [&_input]:size-5 h-8"
              checked={!!selected?.find((s) => s.specId === spec.specId)}
              onChange={() => onChange?.(teamId, spec.specId, user.id)}
            />
          ))}
        </div>
      ) : (
        <span className="text-gray-500 font-medium text-sm pt-2 pb-3">
          Командные специализации не выбраны. Вы можете выбрать их нажав на
          кнопку «Редактировать» возле имени пользователя или на вкладке «Состав
          команды»
        </span>
      )}
    </div>
  );
}
