import { openModalAtom } from "@/atoms/modalAtom";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import Divider from "@/shared/ui/Divider";
import SoftButton from "@/shared/ui/SoftButton";
import { useSetAtom } from "jotai";
import SupportList from "./SupportList/SupportList";
import GridCardsListLayout from "@/features/GridCardsListLayout";

export default function SupportDesktop() {
  const openModal = useSetAtom(openModalAtom);

  return (
    <AnimationWrapper.ScaleOpacity>
      <GridCardsListLayout
        title="Поддержка"
        description="Список ваших планов развития"
        wrapperClassName="flex flex-col"
        button={
          <SoftButton onClick={() => openModal({ type: "SUPPORT" })}>
            Открыть тикет
          </SoftButton>
        }
      >
        <Divider />
        <SupportList />
      </GridCardsListLayout>
    </AnimationWrapper.ScaleOpacity>
  );
}
