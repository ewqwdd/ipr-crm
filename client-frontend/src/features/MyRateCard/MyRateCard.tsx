import { openModalAtom } from "@/atoms/modalAtom";
import { userAtom } from "@/atoms/userAtom";
import { dateService } from "@/shared/lib/services/dateService";
import { rateService } from "@/shared/lib/services/rateService";
import { queryKeys } from "@/shared/types/query-keys";
import type { Rate } from "@/shared/types/Rate";
import Badge from "@/shared/ui/Badge";
import ShadowCard from "@/shared/ui/ShadowCard";
import SoftButton from "@/shared/ui/SoftButton";
import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router";

interface MyRateCardProps {
  rate: Rate;
}

export default function MyRateCard({ rate }: MyRateCardProps) {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();

  const userConfirmed = rate.userConfirmed;
  const curatoConfirmed = rate.curatorConfirmed;
  const userRates = rate.userRates.filter(
    (r) => r.userId === user?.id && r.approved,
  );
  const isRated =
    rateService.getIndicators(rate.competencyBlocks).length <= userRates.length;
  const openModal = useSetAtom(openModalAtom);

  let button;
  if (!userConfirmed) {
    button = (
      <SoftButton
        onClick={() =>
          openModal({
            type: "RATE_CONFIRM",
            data: { rate, key: queryKeys.confirmRates },
          })
        }
        variant="primary"
      >
        Выбрать оценивающих
      </SoftButton>
    );
  } else if (!curatoConfirmed) {
    button = (
      <SoftButton disabled variant="teritary">
        Не утверждено куратором
      </SoftButton>
    );
  } else if (!isRated) {
    button = (
      <SoftButton
        onClick={() =>
          openModal({
            type: "RATE_ASSESSMENT",
            data: {
              rate: {
                ...rate,
                userRates: rate.userRates.filter((r) => r.userId === user?.id),
              },
              key: queryKeys.selfRates,
            },
          })
        }
        variant="primary"
      >
        Начать оценку
      </SoftButton>
    );
  } else if (!rate.finished) {
    button = (
      <SoftButton disabled variant="teritary">
        Оценка не завершена
      </SoftButton>
    );
  } else {
    button = (
      <SoftButton disabled variant="teritary">
        Завершено
      </SoftButton>
    );
  }

  return (
    <ShadowCard>
      <div className="flex items-center gap-2">
        <span className="truncate flex-1">{rate.team?.name}</span>
        <Badge className="capitalize" variant="secondary">
          {rate.type.toLowerCase()} skills
        </Badge>
      </div>
      <h2 className="text-lg truncate mt-2">{rate.spec.name}</h2>
      <div className="flex gap-2 mt-3">
        <div className="flex gap-2 flex-wrap flex-1">
          {button}
          {rate.finished && rate.showReportToUser && (
            <SoftButton
              onClick={() => navigate(`/report/${rate.id}`)}
              variant="primary"
            >
              Показать отчёт
            </SoftButton>
          )}
        </div>
        <span className="text-sm self-end text-secondary whitespace-nowrap">
          {rate.startDate && dateService.formatDate(rate.startDate)}
        </span>
      </div>
    </ShadowCard>
  );
}
