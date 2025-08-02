import { useGetIprById } from "@/shared/hooks/ipr";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import Card from "@/shared/ui/Card";
import IprTaskList from "@/widgets/IprTaskList";
import { useParams } from "react-router";
import IprHeading from "@/widgets/IprHeading";
import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import Divider from "@/shared/ui/Divider";

export default function Plan() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useGetIprById(id);
  const isMobile = useIsMobile();

  const heading = isMobile ? (
    <div className="px-5 pt-5 font-extrabold">
      <IprHeading data={data!} />
    </div>
  ) : (
    <Card>
      <IprHeading data={data!} />
    </Card>
  );

  const body = data && (
    <>
      <span className="text-sm text-secondary">Цель</span>
      <p className="mt-1">{data.goal || "Не указано"}</p>
      <IprTaskList
        type={"GENERAL"}
        ipr={data}
        label={"Общие материалы и задачи для развития"}
      />
      <IprTaskList type={"OBVIOUS"} ipr={data} label="Очевидные зоны роста" />

      <IprTaskList
        type={"OTHER"}
        ipr={data}
        label="Прочие материалы и задачи для развития"
      />
    </>
  );

  return (
    <AnimationWrapper.ScaleOpacity>
      {isPending && (
        <>
          <Card className="h-40 animate-pulse" />
          <Card className="h-64 animate-pulse mt-5" />
        </>
      )}
      {data && (
        <>
          {heading}
          {isMobile && <Divider />}
          {isMobile ? (
            <div className="flex flex-col font-extrabold px-5">{body}</div>
          ) : (
            <Card className="mt-5">{body}</Card>
          )}
        </>
      )}
    </AnimationWrapper.ScaleOpacity>
  );
}
