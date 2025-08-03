import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router";

const MyRatesDesktop = lazy(() => import("./MyRates.desktop"));

export default function MyRates() {
  const isMobile = useIsMobile();

  if (isMobile) return <Navigate to="/" replace />;

  return (
    <Suspense>
      <MyRatesDesktop />
    </Suspense>
  );
}
