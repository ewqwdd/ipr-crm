import { AddUser } from "@/pages/AddUser";
import Login from "@/pages/Login/Login";
import { UserEdit } from "@/pages/UserEdit";
import Users from "@/pages/Users/Users";
import { Route, Routes } from "react-router";

export default function AppRouter() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/userEdit/:id" element={<UserEdit />} />
        <Route path="/addUser" element={<AddUser />} />
    </Routes>
  )
}
