import { Outlet } from "react-router";
import NavbarDesktop from "./Nav/Navbar.desktop";
import Sidebar from "./Sidebaar/Sidebar";
import {
  useGetAssignedRates,
  useGetConfirmCuratorRates,
  useGetConfirmRates,
  useGetSelfRates,
} from "@/shared/hooks/rates";
import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import NavbarMobile from "./Nav/Navbar.mobile";

export default function AppLayout() {
  useGetAssignedRates();
  useGetSelfRates();
  useGetConfirmRates();
  useGetConfirmCuratorRates();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-7 layout max-lg:pb-28">
      {!isMobile ? <NavbarDesktop /> : <NavbarMobile />}
      <div className="flex gap-10 items-start flex-1">
        {!isMobile && <Sidebar />}
        <main className="flex-1 self-stretch">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
