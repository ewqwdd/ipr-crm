import { generalService } from "@/shared/lib/services/generalService";
import type { User } from "@/shared/types/User";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import Divider from "@/shared/ui/Divider";
import SoftButton from "@/shared/ui/SoftButton";
import DetailItem from "./DetailItem";

interface UserDetailsProps {
  user?: User | null;
  onEdit?: () => void;
  headerButtons?: React.ReactNode;
}

export default function UserDetails({
  onEdit,
  user,
  headerButtons,
}: UserDetailsProps) {
  const name =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`
      : user?.username;

  return (
    <>
      <div className="flex lg:items-center gap-3 font-extrabold">
        <Avatar
          src={generalService.transformFileUrl(user?.avatar)}
          alt="user avatar"
          className="size-14"
        />

        <div className="flex max-lg:flex-col items-start lg:items-center lg:flex-1 gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg">{name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-accent">@{user?.username}</span>
              <Badge variant="secondary">{user?.role.name}</Badge>
            </div>
          </div>
          <SoftButton className="lg:ml-auto" onClick={onEdit}>
            Редактировать
          </SoftButton>
        </div>

        {headerButtons}
      </div>
      <Divider />
      <div className="lg:grid grid-cols-4 gap-2 flex flex-col">
        <DetailItem label="Email" value={user?.email} />
        <DetailItem label="Телефон" value={user?.phone} />
      </div>
      <div className="lg:grid grid-cols-4 gap-2 mt-2 lg:mt-3 flex flex-col">
        <DetailItem label="Специализация" value={user?.Spec?.name} />
        <DetailItem
          className="gap-1"
          label="Команды"
          value={
            user?.teams && user?.teams?.length > 0
              ? user?.teams?.map((team) => (
                  <Badge
                    variant="secondary"
                    key={team.teamId}
                    className="truncate max-w-full"
                  >
                    {team.team.name}
                  </Badge>
                ))
              : null
          }
        />
        <DetailItem
          label="Руководитель в командах"
          value={
            user?.teamCurator && user?.teamCurator?.length > 0
              ? user?.teamCurator?.map((team) => (
                  <Badge variant="secondary" key={team.id}>
                    {team.name}
                  </Badge>
                ))
              : null
          }
        />
      </div>
    </>
  );
}
