import { openModalAtom } from "@/atoms/modalAtom";
import { dateService } from "@/shared/lib/services/dateService";
import { generalService } from "@/shared/lib/services/generalService";
import type { Rate } from "@/shared/types/Rate";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import ShadowCard from "@/shared/ui/ShadowCard";
import SoftButton from "@/shared/ui/SoftButton";
import { useSetAtom } from "jotai";

interface Props {
  rate: Rate;
  queryKey: string;
}

export default function ConfirmRate({ rate, queryKey }: Props) {
  const openModal = useSetAtom(openModalAtom);

  return (
    <ShadowCard>
      <div className="flex items-center gap-2">
        <Avatar
          src={generalService.transformFileUrl(rate.user.avatar)}
          className="size-6"
        />
        <span className="truncate">{rate.user.username}</span>
        <Badge className="ml-auto inline-block" variant="secondary">
          <span className="capitalize">{rate.type.toLowerCase()}</span> skills
        </Badge>
      </div>
      <p className="text-lg mt-2">{rate.team?.name}</p>
      <div className="flex justify-between mt-3 items-end">
        <SoftButton
          onClick={() =>
            openModal({ type: "RATE_CONFIRM", data: { rate, key: queryKey } })
          }
          variant="primary"
        >
          Выбрать оценивающих
        </SoftButton>
        <span className="text-secondary text-sm">
          {rate.startDate && dateService.formatDate(rate.startDate)}
        </span>
      </div>
    </ShadowCard>
  );
}
