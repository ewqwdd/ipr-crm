import Login from "@/pages/Login/Login";
import Team from "@/pages/Team/Team";
import { Route, Routes } from "react-router";

export default function AppRouter() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/team" element={<Team />} />
    </Routes>
  )
}
