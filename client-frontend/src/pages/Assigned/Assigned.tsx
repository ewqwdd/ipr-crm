import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import { lazy, Suspense } from "react";

const AssignedDesktop = lazy(() => import("./Assigned.desktop"));
const AssignedMobile = lazy(() => import("./Assigned.mobile"));

export default function Assigned() {
  const isMobile = useIsMobile();

  return (
    <Suspense>{!isMobile ? <AssignedDesktop /> : <AssignedMobile />}</Suspense>
  );
}
