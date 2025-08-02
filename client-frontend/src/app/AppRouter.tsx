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

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/invite" element={<ResetPassword />} />
        <Route path="/link-sent" element={<LinkSent />} />
        <Route path="/report/:id" element={<Report />} />
        {/* Protected routes with layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/assigned" element={<Assigned />} />
          <Route path="/board" element={<Board />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/:id" element={<Plan />} />
          <Route path="/my-rates" element={<MyRates />} />
          <Route path="/support" element={<Support />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
