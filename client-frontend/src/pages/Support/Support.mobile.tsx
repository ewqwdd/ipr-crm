import { openModalAtom } from "@/atoms/modalAtom";
import Multiply from "@/shared/icons/Multiply.svg";
import Divider from "@/shared/ui/Divider";
import SoftButton from "@/shared/ui/SoftButton";
import { useSetAtom } from "jotai";
import { Link } from "react-router";
import SupportList from "./SupportList/SupportList";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";

export default function SupportMobile() {
  const openModal = useSetAtom(openModalAtom);

  return (
    <AnimationWrapper.ScaleOpacity>
      <div className="flex flex-col font-extrabold ">
        <div className="p-5 flex flex-col gap-3 pb-0">
          <div className="flex gap-3 items-center">
            <h1 className="text-lg truncate flex-1">Поддержка</h1>
            <Link to="/">
              <Multiply className="size-6 text-teritary" />
            </Link>
          </div>
          <SoftButton
            className="self-start"
            onClick={() => openModal({ type: "SUPPORT" })}
          >
            Открыть тикет
          </SoftButton>
        </div>

        <Divider />
        <div className="flex flex-col px-5">
          <SupportList />
        </div>
      </div>
    </AnimationWrapper.ScaleOpacity>
  );
}
