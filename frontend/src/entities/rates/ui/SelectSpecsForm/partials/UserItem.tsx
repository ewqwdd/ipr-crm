import { AddRateDto, ChangeSpecsType } from '@/entities/rates/types/types';
import { TeamUser } from '@/entities/team';
import { Avatar } from '@/shared/ui/Avatar';
import { Checkbox } from '@/shared/ui/Checkbox';
import { ModalStateType } from './TeamList/TeamList';
import { SoftButton } from '@/shared/ui/SoftButton';
import { PencilAltIcon } from '@heroicons/react/outline';
import { StarIcon } from '@heroicons/react/solid';
import { generalService } from '@/shared/lib/generalService';
import { DeputyList } from '@/features/user/DeputyList';

interface UserItemProps {
  user: TeamUser;
  selected?: AddRateDto['specs'];
  onChange?: (data: ChangeSpecsType | ChangeSpecsType[]) => void;
  teamId: number;
  setOpen?: (v: ModalStateType) => void;
  curatorSpecs?: TeamUser['specsOnTeams'];
  curator?: boolean;
}

export default function UserItem({
  user,
  selected,
  onChange,
  teamId,
  setOpen,
  curatorSpecs,
  curator,
}: UserItemProps) {
  const userSpecsExist = user.specsOnTeams && user.specsOnTeams?.length > 0;
  const curatorSpecsExist = curatorSpecs && curatorSpecs?.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {curator && <StarIcon className="text-yellow-500 size-4" />}
        <Avatar src={generalService.transformFileUrl(user.avatar)} />
        <span>{user.username}</span>
        <SoftButton className="p-1" onClick={() => setOpen?.({ teamId, user })}>
          <PencilAltIcon className="size-4" />
        </SoftButton>
        <DeputyList user={user} />
      </div>
      {userSpecsExist || curatorSpecsExist ? (
        <div className="flex flex-col pl-2 bg-violet-50 pt-2 pb-3">
          {(user.specsOnTeams || curatorSpecs)
            ?.filter((s) => !!s.spec.active)
            .map((spec) => (
              <Checkbox
                key={spec.specId}
                title={spec?.spec.name}
                className="[&_label]:text-base [&_input]:size-5 h-8"
                checked={
                  !!selected?.find(
                    (s) => s.specId === spec.specId && s.userId === user.id,
                  )
                }
                onChange={() =>
                  onChange?.({ teamId, specId: spec.specId, userId: user.id })
                }
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
