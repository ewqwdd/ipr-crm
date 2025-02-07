import { teamsApi } from '@/shared/api/teamsApi';
import { cva } from '@/shared/lib/cva';
import { DotsDropdown } from '@/shared/ui/DotsDropdown';

interface LeaderDropdownProps {
  teamId: number;
  setOpenNew?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeaderDropdown({
  teamId,
  setOpenNew,
}: LeaderDropdownProps) {
  const [mutate, { isLoading }] = teamsApi.useRemoveCuratorMutation();

  return (
    <DotsDropdown
      bodyClassName="max-w-40"
      ddBtnClassName="text-sm"
      btnClassName="bg-purple-100 text-purple-700 hover:text-purple-800"
      className={cva('ml-2', {
        'animate-pulse pointer-events-none': isLoading,
      })}
      buttons={[
        {
          text: 'Убрать',
          onClick: () => mutate(teamId),
        },
        {
          text: 'Выбрать нового',
          onClick: () => setOpenNew?.(true),
        },
      ]}
    />
  );
}
