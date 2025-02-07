import { AddUser } from '@/pages/AddUser';
import Login from '@/pages/Login/Login';
import { Rate360 } from '@/pages/Rate360';
import { Skills } from '@/pages/Skills';
import { Structure } from '@/pages/Structure';
import { TeamPage } from '@/pages/TeamPage';
import { Teams } from '@/pages/Teams';
import { UserEdit } from '@/pages/UserEdit';
import { UserPage } from '@/pages/UserPage';
import Users from '@/pages/Users/Users';
import { Route, Routes } from 'react-router';

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
      <Route path="/structure" element={<Structure />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/teams/:id" element={<TeamPage />} />
      <Route path="/360rate" element={<Rate360 />} />
      <Route path="/skills" element={<Skills />} />
    </Routes>
  );
}
