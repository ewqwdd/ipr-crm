import { dateService } from "@/shared/lib/services/dateService";
import { generalService } from "@/shared/lib/services/generalService";
import type { Rate } from "@/shared/types/Rate";
import Avatar from "@/shared/ui/Avatar";
import SoftButton from "@/shared/ui/SoftButton";
import Title from "@/shared/ui/Title";

interface ReportHeaderProps {
  rate: Rate;
  onClickExport: () => void;
}

export default function ReportHeader({
  rate,
  onClickExport,
}: ReportHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <Title title="Отчёт оценки" description={rate?.team?.name} />
        <SoftButton onClick={onClickExport}>Экспорт</SoftButton>
      </div>
      <div className="flex gap-2 text-sm items-center">
        <Avatar
          className="size-10"
          src={generalService.transformFileUrl(rate?.user.avatar)}
        />
        <div className="text-sm">
          <p>{rate?.user.username}</p>
          <p className="text-secondary">{rate?.spec.name}</p>
        </div>
        <span className="ml-auto">
          {rate?.startDate && dateService.formatDate(rate?.startDate)}
        </span>
      </div>
    </>
  );
}
