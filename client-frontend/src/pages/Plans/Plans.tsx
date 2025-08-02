import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import { lazy, Suspense } from "react";

const PlansMobile = lazy(() => import("./Plans.mobile"));
const PlansDesktop = lazy(() => import("./Plans.desktop"));

export default function Plans() {
  const isMobile = useIsMobile();
  return <Suspense>{!isMobile ? <PlansDesktop /> : <PlansMobile />}</Suspense>;
}
