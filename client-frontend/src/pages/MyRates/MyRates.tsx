import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import { lazy, Suspense } from "react";

const MyRatesMobile = lazy(() => import("./MyRates.mobile"));
const MyRatesDesktop = lazy(() => import("./MyRates.desktop"));

export default function MyRates() {
  const isMobile = useIsMobile();

  return (
    <Suspense>{!isMobile ? <MyRatesDesktop /> : <MyRatesMobile />}</Suspense>
  );
}
