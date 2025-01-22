import { AddUser } from "@/pages/AddUser";
import Login from "@/pages/Login/Login";
import { UserEdit } from "@/pages/UserEdit";
import { UserPage } from "@/pages/UserPage";
import Users from "@/pages/Users/Users";
import { Route, Routes } from "react-router";

export default function AppRouter() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/users">
          <Route index element={<Users />} />
          <Route path=":id" element={<UserPage />} />
        </Route>
        <Route path="/userEdit/:id" element={<UserEdit />} />
        <Route path="/addUser" element={<AddUser />} />
    </Routes>
  )
}
