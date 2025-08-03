import { Outlet } from "react-router";

import {
  useGetAssignedRates,
  useGetConfirmCuratorRates,
  useGetConfirmRates,
  useGetSelfRates,
} from "@/shared/hooks/rates";

export default function AppLayout() {
  useGetAssignedRates();
  useGetSelfRates();
  useGetConfirmRates();
  useGetConfirmCuratorRates();

  return (
    <main className="flex-1 self-stretch">
      <Outlet />
    </main>
  );
}
