import BoardLink from "@/features/BoardLink/BoardLink";
import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import { dateService } from "@/shared/lib/services/dateService";
import type { Ipr } from "@/shared/types/Ipr";
import Divider from "@/shared/ui/Divider";
import StatItem from "@/shared/ui/StatItem";
import { memo } from "react";

interface IprHeadingProps {
  data: Ipr;
}

export default memo(function IprHeading({ data }: IprHeadingProps) {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex justify-between items-center gap-3">
        <h1 className="text-lg">Индивидуальный план развития №{data.id}</h1>
        <BoardLink
          url={isMobile ? "/plans?tab=board" : "/board"}
          className="whitespace-nowrap"
        />
      </div>
      <Divider />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatItem
          className="[&>p]:text-base"
          label="Специализация"
          value={data.rate360.spec.name}
        />
        <StatItem
          className="[&>p]:text-base [&>p]:capitalize"
          label="Навыки"
          value={data.rate360.type.toLowerCase()}
        />
        <StatItem
          className="[&>p]:text-base"
          label="Команда"
          value={data.rate360.team?.name}
        />
        <StatItem
          className="[&>p]:text-base"
          label="Дата оценки"
          value={
            data.rate360.startDate &&
            dateService.formatDate(data.rate360.startDate)
          }
        />
      </div>
    </>
  );
});
