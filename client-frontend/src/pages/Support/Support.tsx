import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import { lazy, Suspense } from "react";

const SupportDesktop = lazy(() => import("./Support.desktop"));
const SupportMobile = lazy(() => import("./Support.mobile"));

export default function Support() {
  const isMobile = useIsMobile();

  return (
    <Suspense>{!isMobile ? <SupportDesktop /> : <SupportMobile />}</Suspense>
  );
}
