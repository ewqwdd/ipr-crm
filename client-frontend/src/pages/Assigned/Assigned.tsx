import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import AssignedRatesList from "./AssignedRatesList/AssignedRatesList";
import ConfirmRatesList from "./ConfirmRatesList/ConfirmRatesList";
import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import { Navigate } from "react-router";

export default function Assigned() {
  const isMobile = useIsMobile();

  if (isMobile) return <Navigate to="/my-rates" />;

  return (
    <AnimationWrapper.ScaleOpacity>
      <div className="flex flex-col gap-5">
        <ConfirmRatesList />
        <AssignedRatesList />
      </div>
    </AnimationWrapper.ScaleOpacity>
  );
}
