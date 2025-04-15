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
import { ResetPassword } from '@/pages/ResetPassword';
import { Ipr } from '@/pages/Ipr';
import { Board } from '@/pages/Board';
import { AdminBoard } from '@/pages/AdminBoard';
import { IprList } from '@/pages/IprList';
import { SkillsHistory } from '@/pages/SkillsHistory';
import { SkillsHistoryElement } from '@/pages/SkillsHistoryElement';
import { Tests } from '@/pages/Tests';
import { TestCreate } from '@/pages/TestCreate';
import { TestAssesment } from '@/pages/TestAssesment';
import { AssignedTests } from '@/pages/AssignedTests';
import { FinishedTest } from '@/pages/FinishedTest';
import { TestEdit } from '@/pages/TestEdit';
import { Surveys } from '@/pages/Surveys';
import { SurveyCreate } from '@/pages/SurveyCreate';
import { SurveyEdit } from '@/pages/SurveyEdit';
import { AssignedSurveys } from '@/pages/AssignedSurveys';
import { SurveyAssesment } from '@/pages/SurveyAssesment';
import { FinishedSurvey } from '@/pages/FinishedSurvey';

export const routerItems: RouterItemType[] = [
  { path: '/login', element: <Login /> },
  { path: '/invite', element: <ResetPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
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
  { path: '/teams/:id', element: <TeamPage />, onlyAdmin: true, curator: true },
  { path: '/360rate', element: <Rate360 />, onlyAdmin: true, curator: true },
  {
    path: '/360rate/report/:id',
    element: <Report360 />,
    onlyAdmin: true,
    curator: true,
  },
  { path: '/skills', element: <Skills />, onlyAdmin: true },
  { path: '/profile', element: <Profile /> },
  { path: '/progress', element: <Progress /> },
  { path: '/progress/:id', element: <Rate360Assesment /> },
  { path: '/', element: <Profile /> },
  { path: '/ipr/360/:rateId', element: <Ipr /> },
  { path: '/board', element: <Board /> },
  { path: '/board/:userId', element: <AdminBoard /> },
  { path: '/ipr', element: <IprList />, onlyAdmin: true, curator: true },
  { path: '/skills/history', element: <SkillsHistory />, onlyAdmin: true },
  {
    path: '/skills/history/:id',
    element: <SkillsHistoryElement />,
    onlyAdmin: true,
  },
  { path: '/tests', element: <Tests />, onlyAdmin: true, curator: true },
  {
    path: '/tests/create',
    element: <TestCreate />,
    onlyAdmin: true,
    curator: true,
  },
  {
    path: '/tests/:id',
    element: <TestAssesment />,
  },
  {
    path: '/tests-edit/:id',
    element: <TestEdit />,
    curator: true,
    onlyAdmin: true,
  },
  {
    path: '/assigned-tests',
    element: <AssignedTests />,
  },
  {
    path: '/test-finish/:id',
    element: <FinishedTest />,
  },
  {
    path: '/surveys',
    element: <Surveys />,
    onlyAdmin: true,
    curator: true,
  },
  {
    path: '/surveys/create',
    element: <SurveyCreate />,
    onlyAdmin: true,
    curator: true,
  },
  {
    path: '/survey-edit/:id',
    element: <SurveyEdit />,
    onlyAdmin: true,
    curator: true,
  },
  {
    path: '/assigned-surveys',
    element: <AssignedSurveys />,
  },
  {
    path: '/surveys/:id',
    element: <SurveyAssesment />,
  },
  {
    path: '/survey-finish/:id',
    element: <FinishedSurvey />,
  },
];

export const guestRoutes = ['/login', '/invite', '/reset-password'];
