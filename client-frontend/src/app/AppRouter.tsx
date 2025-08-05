import { Route, Routes, useLocation } from "react-router";
import AppLayout from "./AppLayout/AppLayout";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import LinkSent from "@/pages/LinkSent";
import ResetPassword from "@/pages/ResetPassword";
import { AnimatePresence } from "framer-motion";
import Home from "@/pages/Home";
import Assigned from "@/pages/Assigned";
import Support from "@/pages/Support";
import MyRates from "@/pages/MyRates";
import Plans from "@/pages/Plans";
import Plan from "@/pages/Plan";
import Board from "@/pages/Board";
import Report from "@/pages/Report";
import { ROUTES } from "@/shared/constants/routes";

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.INVITE} element={<ResetPassword />} />
        <Route path={ROUTES.LINK_SENT} element={<LinkSent />} />
        <Route path={ROUTES.REPORT} element={<Report />} />
        {/* Protected routes with layout */}
        <Route element={<AppLayout />}>
          <Route path={ROUTES.PROFILE} element={<Home />} />
          <Route path={ROUTES.HOME} element={<Assigned />} />
          <Route path={ROUTES.BOARD} element={<Board />} />
          <Route path={ROUTES.PLANS} element={<Plans />} />
          <Route path={ROUTES.PLAN} element={<Plan />} />
          <Route path={ROUTES.MY_RATES} element={<MyRates />} />
          <Route path={ROUTES.SUPPORT} element={<Support />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
