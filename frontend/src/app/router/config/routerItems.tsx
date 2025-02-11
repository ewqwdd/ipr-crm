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
import { RouterItemType } from './types';
import { Profile } from '@/pages/Profile';
import { ProfileEdit } from '@/pages/ProfileEdit';
import { Progress } from '@/pages/Progress';
import { Rate360Assesment } from '@/pages/Rate360Assesment';
import Report360 from '@/pages/Report360';

export const routerItems: RouterItemType[] = [
  { path: '/login', element: <Login /> },
  { path: '/users/:id', element: <UserPage /> },
  {
    path: '/users',
    element: <Users />,
    onlyAdmin: true,
  },
  { path: '/userEdit/:id', element: <UserEdit />, onlyAdmin: true },
  { path: '/userEdit', element: <ProfileEdit /> },
  { path: '/addUser', element: <AddUser />, onlyAdmin: true },
  { path: '/structure', element: <Structure />, onlyAdmin: true },
  { path: '/teams', element: <Teams />, onlyAdmin: true },
  { path: '/teams/:id', element: <TeamPage />, onlyAdmin: true },
  { path: '/360rate', element: <Rate360 />, onlyAdmin: true },
  { path: '/360rate/report/:id', element: <Report360 />, onlyAdmin: true },
  { path: '/skills', element: <Skills />, onlyAdmin: true },
  { path: '/profile', element: <Profile /> },
  { path: '/progress', element: <Progress /> },
  { path: '/progress/:id', element: <Rate360Assesment /> },
  { path: '/', element: <Profile /> },
];
