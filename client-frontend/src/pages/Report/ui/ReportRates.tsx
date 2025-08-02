import { cva } from "@/shared/lib/cva";
import { rateService } from "@/shared/lib/services/rateService";
import type { Rate } from "@/shared/types/Rate";
import ReportTableWrapper from "./ReportTableWrapper";

interface ReportRatesProps {
  rate: Rate;
}

const commonHeaders = [
  "Руководители",
  "Коллеги",
  "Подчиненные",
  "Самооц.",
] as const;

const RateCell = ({
  rate,
  boundary = 3,
  className,
}: {
  rate?: number;
  boundary?: number;
  className?: string;
}) => {
  if (!rate)
    return (
      <td className={cva("px-3 py-4 text-sm text-center", className)}>N/D</td>
    );

  const color =
    rate > boundary ? "text-success" : rate === boundary ? "" : "text-error";
  return (
    <td
      className={cva(
        "whitespace-nowrap px-3 py-4 text-sm text-center",
        className,
        color,
      )}
    >
      {rate.toFixed(2)}
    </td>
  );
};
const keys = ["curators", "teamMembers", "subbordinates", "self"] as const;

export default function ReportRates({ rate }: ReportRatesProps) {
  const competencyBlocks = rate.competencyBlocks;
  const countRates = rateService.countCompetencyBlockRates(
    competencyBlocks,
    rate,
  );

  const avgSelfRates =
    countRates.reduce((acc, item) => acc + item.self, 0) / countRates.length;
  const avgSubbordinatesRates =
    countRates.reduce((acc, item) => acc + item.subbordinates, 0) /
    countRates.length;
  const avgCuratorsRates =
    countRates.reduce((acc, item) => acc + item.curators, 0) /
    countRates.length;
  const avgTeamMembersRates =
    countRates.reduce((acc, item) => acc + item.teamMembers, 0) /
    countRates.length;

  console.debug(countRates);

  return (
    <div className="flex flex-col gap-4 mt-4">
      {countRates.map((item) => (
        <div key={item.competencyBlockId} className="flex flex-col gap-2">
          <h3>{item.name}</h3>
          {item.competencyRates.map((competency) => (
            <ReportTableWrapper
              key={competency.competencyId}
              headers={["Компетенция/Индикатор", ...commonHeaders]}
            >
              <tr>
                <td className="text-sm text-accent px-3 py-4 w-full">
                  {competency.name}
                </td>
                {keys.map((key) => (
                  <RateCell
                    key={key}
                    rate={competency[key]}
                    className="text-accent"
                  />
                ))}
              </tr>
              {competency.indicatorRates.map((indicator) => (
                <tr key={indicator.indicatorId}>
                  <td className="text-sm text-primary font-semibold px-3 py-4">
                    {indicator.name}
                  </td>
                  {keys.map((key) => (
                    <RateCell key={key} rate={indicator[key]} />
                  ))}
                </tr>
              ))}
            </ReportTableWrapper>
          ))}
        </div>
      ))}
      <ReportTableWrapper headers={["Общая оцегка", ...commonHeaders]}>
        <tr>
          <td className="text-sm px-3 py-4 w-full">Общая оценка</td>
          <RateCell rate={avgCuratorsRates} />
          <RateCell rate={avgTeamMembersRates} />
          <RateCell rate={avgSubbordinatesRates} />
          <RateCell rate={avgSelfRates} />
        </tr>
      </ReportTableWrapper>
    </div>
  );
}
