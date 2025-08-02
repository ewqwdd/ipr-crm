import { cva } from "@/shared/lib/cva";
import type { EvaulatorType, Rate } from "@/shared/types/Rate";
import type { Team, TeamUser } from "@/shared/types/Team";
import Checkbox from "@/shared/ui/Checkbox";
import Crown from "@/shared/icons/Crown.svg";
import toast from "react-hot-toast";
import { memo } from "react";

interface TeamEvaluatorItemProps {
  name: string;
  evaulators: Rate["evaluators"];
  setEvaulators: React.Dispatch<React.SetStateAction<Rate["evaluators"]>>;
  team: Pick<Team, "curator" | "users">;
  rateTeamUserIds: number[];
  otherTypeEvaluators: Rate["evaluators"];
  type: EvaulatorType;
}

export default memo(function TeamEvaluatorItem({
  name,
  evaulators,
  setEvaulators,
  team,
  rateTeamUserIds,
  otherTypeEvaluators,
  type,
}: TeamEvaluatorItemProps) {
  const isCuratorChecked =
    evaulators.some((ev) => ev.userId === team.curator?.id) || !team.curator;
  const isAllChecked =
    team.users?.every((u) =>
      evaulators.some((ev) => ev.userId === u.user.id),
    ) && isCuratorChecked;

  const validate = (ids: number[]) => {
    const notInTeam = [
      ...ids,
      ...otherTypeEvaluators.map((ev) => ev.userId),
    ].filter((id) => !rateTeamUserIds.includes(id));
    if (notInTeam.length > 10) {
      toast.error("Максимум 10 человек из других команд");
      return false;
    }
    return true;
  };

  const toggleTeam = () => {
    if (isAllChecked) {
      setEvaulators((prev) =>
        prev.filter(
          (ev) =>
            !team.users?.some((u) => u.user.id === ev.userId) &&
            ev.userId !== team.curator?.id,
        ),
      );
    } else {
      const members = team.users!.map((u) => ({
        userId: u.user.id,
        type: type,
        user: {
          id: u.user.id,
          username: u.user.username,
          avatar: u.user.avatar,
        },
      }));
      const curator = team.curator
        ? [
            {
              type: type,
              userId: team.curator.id,
              user: {
                id: team.curator.id,
                username: team.curator.username,
                avatar: team.curator.avatar,
              },
            },
          ]
        : [];
      const newUsers = [...evaulators, ...members, ...curator].filter(
        (ev, i, arr) => arr.findIndex((e) => e.userId === ev.userId) === i,
      );
      if (!validate(newUsers.map((ev) => ev.userId))) return;
      setEvaulators(newUsers);
    }
  };

  const toggleEvaluator = (user: TeamUser) => {
    if (evaulators.some((ev) => ev.userId === user.id)) {
      setEvaulators((prev) => prev.filter((ev) => ev.userId !== user.id));
    } else {
      const newUsers = [
        ...evaulators,
        {
          userId: user.id,
          type: type,
          user: { id: user.id, username: user.username, avatar: user.avatar },
        } as Rate["evaluators"][0],
      ];
      if (!validate(newUsers.map((ev) => ev.userId))) return;
      setEvaulators(newUsers);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label
          className="text-secondary text-sm cursor-pointer"
          onClick={toggleTeam}
          htmlFor={name}
        >
          {name}
        </label>
        <Checkbox name={name} checked={isAllChecked} onChange={toggleTeam} />
      </div>
      <div>
        {team.curator && (
          <div className="flex items-center gap-1 h-8">
            <Checkbox
              name={team.curator.username}
              checked={isCuratorChecked}
              onChange={() => toggleEvaluator(team.curator!)}
            />
            <label
              className={cva("text-sm cursor-pointer transition-all ml-1", {
                "text-accent ml-2": isCuratorChecked,
              })}
              onClick={() => toggleEvaluator(team.curator!)}
              htmlFor={team.curator.username}
            >
              {team.curator.username}
            </label>
            <Crown
              className={cva("size-5 transition-all", {
                "text-accent": isCuratorChecked,
              })}
            />
          </div>
        )}
        {team.users?.map((user) => {
          const isActive = evaulators.some((ev) => ev.userId === user.user.id);
          return (
            <div className="flex items-center gap-2 h-8">
              <Checkbox
                name={user.user.username}
                checked={isActive}
                onChange={() => toggleEvaluator(user.user)}
              />
              <label
                className={cva("text-sm cursor-pointer transition-all", {
                  "text-accent ml-1": isActive,
                })}
                onClick={() => toggleEvaluator(user.user)}
                htmlFor={user.user.username}
              >
                {user.user.username}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
});
