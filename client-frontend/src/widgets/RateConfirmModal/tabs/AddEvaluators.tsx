import type { EvaulatorType, Rate } from "@/shared/types/Rate";
import { useGetUsers } from "@/shared/hooks/users";
import { useGetTeams } from "@/shared/hooks/teams";
import TeamEvaluatorItem from "./TeamEvaluatorItem";
import { useDeferredValue, useMemo, useState } from "react";
import TeamsSelect from "@/features/TeamsSelect";
import Input from "@/shared/ui/Input";
import { type Team } from "@/shared/types/Team";
import Button from "@/shared/ui/Button";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";

interface AddEvaluatorsProps {
  onSubmit: (evaluators: Rate["evaluators"]) => void;
  onCancel: () => void;
  initialEvaluators: Rate["evaluators"];
  rateTeamId?: number;
  type: EvaulatorType;
}

export default function AddEvaluators({
  initialEvaluators,
  onCancel,
  onSubmit,
  rateTeamId,
  type,
}: AddEvaluatorsProps) {
  const { isPending: isPendingUsers, data: users } = useGetUsers();
  const { isPending: isPendingTeams, data: team } = useGetTeams();
  const [teamId, setTeamId] = useState<number | undefined>();
  const [username, setUsername] = useState<string>("");
  const [evaluators, setEvaluators] = useState<Rate["evaluators"]>(
    initialEvaluators.filter((e) => e.type === type),
  );

  const otherTypeEvaluators = useMemo(
    () => initialEvaluators.filter((e) => e.type !== type),
    [initialEvaluators, type],
  );

  const [defferedTeamId, defferedUsername] = [
    useDeferredValue(teamId),
    useDeferredValue(username),
  ];

  const filteredWithTeam = useMemo(
    () =>
      !defferedTeamId
        ? (team?.list ?? [])
        : ([team?.list.find((t) => t.id === defferedTeamId)].filter((t) => t) ??
          []),
    [defferedTeamId, team],
  ) as Team[];

  const filteredWithUsers = useMemo(
    () =>
      filteredWithTeam?.map((t) => ({
        ...t,
        users: t!.users?.filter((u) => {
          return (
            u.user.username
              .toLowerCase()
              .includes(defferedUsername.toLowerCase()) &&
            !otherTypeEvaluators.some((ev) => ev.userId === u.user.id)
          );
        }),
        curator:
          t?.curator &&
          t.curator.username
            .toLowerCase()
            .includes(defferedUsername.toLowerCase()) &&
          !otherTypeEvaluators.some((ev) => ev.userId === t.curator!.id)
            ? t?.curator
            : null,
      })),
    [defferedUsername, filteredWithTeam, otherTypeEvaluators],
  ) as Team[];

  const noTeamUsers = useMemo(
    () =>
      defferedTeamId
        ? []
        : users?.users
            .filter((u) => !u.teams?.length && !u.teamCurator?.length)
            .filter((u) =>
              u.username.toLowerCase().includes(defferedUsername.toLowerCase()),
            )
            .filter(
              (u) => !otherTypeEvaluators.some((ev) => ev.userId === u.id),
            ),
    [users, defferedUsername, otherTypeEvaluators, defferedTeamId],
  );

  const rateTeamUserIds = useMemo(() => {
    const found = team?.list.find((t) => t.id === rateTeamId);
    return found
      ? [
          ...(found.users?.map((u) => u.user.id) ?? []),
          ...(found.curator ? [found.curator.id] : []),
        ]
      : [];
  }, [rateTeamId, team]);

  const loading = isPendingUsers || isPendingTeams;

  return (
    <AnimationWrapper.Right>
      <div className="flex flex-col gap-5 flex-1">
        <div className="flex flex-col gap-2">
          <TeamsSelect value={teamId} onChange={setTeamId} />
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Найти"
          />
        </div>

        <div className="max-h-64 overflow-y-auto flex flex-col gap-3">
          {loading &&
            new Array(20).fill(0).map((_, i) => (
              <div
                key={i}
                className="my-1 animate-pulse flex items-center gap-3"
              >
                <figure className="size-5 bg-foreground-1 rounded-sm" />
                <div className="w-44 h-6 bg-foreground-1 rounded-md" />
              </div>
            ))}

          {!loading && noTeamUsers && noTeamUsers?.length > 0 && (
            <TeamEvaluatorItem
              type={type}
              otherTypeEvaluators={otherTypeEvaluators}
              rateTeamUserIds={rateTeamUserIds}
              team={{
                users: noTeamUsers?.map((u) => ({
                  user: u,
                  specsOnTeams: [],
                  deputyRelationsAsDeputy: [],
                })) as Team["users"],
                curator: undefined,
              }}
              evaulators={evaluators}
              name={"Без команды"}
              setEvaulators={setEvaluators}
            />
          )}

          {!loading &&
            filteredWithUsers?.map(
              (team) =>
                (team.curator || (team.users && team.users.length > 0)) && (
                  <TeamEvaluatorItem
                    type={type}
                    otherTypeEvaluators={otherTypeEvaluators}
                    rateTeamUserIds={rateTeamUserIds}
                    team={team}
                    evaulators={evaluators}
                    name={team.name}
                    key={team.id}
                    setEvaulators={setEvaluators}
                  />
                ),
            )}
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={() => onSubmit(evaluators)}>Добавить</Button>
          <Button variant="teritary" onClick={onCancel}>
            Отменить
          </Button>
        </div>
      </div>
    </AnimationWrapper.Right>
  );
}
