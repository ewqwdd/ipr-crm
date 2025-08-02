import { useGetReport } from "@/shared/hooks/rates";
import { useParams } from "react-router";
import ReportHeader from "./ui/ReportHeader";
import ReportEvaluators from "./ui/ReportEvaluators";
import ReportProgressBarBlock from "./ui/ReportProgressBarBlock";
import ReportRates from "./ui/ReportRates";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import { useRef } from "react";
import { exportReportPDF } from "@/shared/lib/exportReportPDF";

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useGetReport(id);
  const ref = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const onClickExport = () => exportReportPDF(ref.current!, loaderRef.current!);

  if (isPending) return;

  return (
    <AnimationWrapper.Opacity>
      <div
        className="flex flex-col gap-7 mx-auto !max-w-5xl py-10 font-extrabold px-3 min-w-3xl"
        ref={ref}
      >
        {!data && !isPending ? (
          <div className="self-center my-auto">
            <span>Недоступно</span>
          </div>
        ) : (
          <>
            <ReportHeader onClickExport={onClickExport} rate={data} />
            <ReportEvaluators evaluators={data.evaluators} />
            <ReportProgressBarBlock type={data.type} />
            <ReportRates rate={data} />
          </>
        )}
      </div>
      <div
        ref={loaderRef}
        className="absolute top-0 left-0 w-full h-full bg-foreground-1 animate-pulse hidden"
      />
    </AnimationWrapper.Opacity>
  );
}
