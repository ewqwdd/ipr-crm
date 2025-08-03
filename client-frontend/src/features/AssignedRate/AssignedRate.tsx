import { openModalAtom } from "@/atoms/modalAtom";
import { userAtom } from "@/atoms/userAtom";
import { cva } from "@/shared/lib/cva";
import { dateService } from "@/shared/lib/services/dateService";
import { generalService } from "@/shared/lib/services/generalService";
import { rateService } from "@/shared/lib/services/rateService";
import type { Rate } from "@/shared/types/Rate";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import ShadowCard from "@/shared/ui/ShadowCard";
import SoftButton from "@/shared/ui/SoftButton";
import { useAtomValue, useSetAtom } from "jotai";

interface Props {
  rate: Rate;
  queryKey: string;
  loading?: boolean;
}

export default function AssignedRate({ rate, queryKey, loading }: Props) {
  const user = useAtomValue(userAtom);
  const indicatorsCount = rateService.getIndicators(
    rate.competencyBlocks,
  ).length;
  const userRates = rate.userRates.filter(
    (r) => r.approved && r.userId === user?.id,
  );

  const openModal = useSetAtom(openModalAtom);

  const isRated = indicatorsCount === userRates.length;

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
        {isRated ? (
          <SoftButton
            disabled
            className={cva("cursor-default", {
              "opacity-60 pointer-events-none": !!loading,
            })}
            variant="teritary"
          >
            Завершено
          </SoftButton>
        ) : (
          <SoftButton
            variant="primary"
            onClick={() =>
              openModal({
                type: "RATE_PROGRESS",
                data: { rate, key: queryKey },
              })
            }
            className={cva({
              "opacity-60 pointer-events-none": !!loading,
            })}
          >
            Начать
          </SoftButton>
        )}
        <span className="text-secondary text-sm">
          {rate.startDate && dateService.formatDate(rate.startDate)}
        </span>
      </div>
    </ShadowCard>
  );
}
