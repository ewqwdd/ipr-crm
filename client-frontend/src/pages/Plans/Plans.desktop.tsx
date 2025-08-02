import BoardLink from "@/features/BoardLink/BoardLink";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import Divider from "@/shared/ui/Divider";
import IprList from "./IprList";
import GridCardsListLayout from "@/features/GridCardsListLayout";

export default function PlansDesktop() {
  return (
    <AnimationWrapper.ScaleOpacity>
      <GridCardsListLayout
        title="Планы развития"
        description="Список ваших планов развития"
        wrapperClassName="flex flex-col"
        button={<BoardLink />}
      >
        <Divider />
        <IprList />
      </GridCardsListLayout>
    </AnimationWrapper.ScaleOpacity>
  );
}
