import Login from '@/pages/Login/Login';
import { RouterItemType } from './types';
import { ResetPassword } from '@/pages/ResetPassword';
import { Profile } from '@/pages/Profile';
import React from 'react';

const UserPage = React.lazy(() => import('@/pages/UserPage/UserPage'));
const Users = React.lazy(() => import('@/pages/Users/Users'));
const UserEdit = React.lazy(() => import('@/pages/UserEdit/UserEdit'));
const ProfileEdit = React.lazy(() => import('@/pages/ProfileEdit/ProfileEdit'));
const AddUser = React.lazy(() => import('@/pages/AddUser/AddUser'));
const Structure = React.lazy(() => import('@/pages/Structure/Structure'));
const Teams = React.lazy(() => import('@/pages/Teams/Teams'));
const TeamPage = React.lazy(() => import('@/pages/TeamPage/TeamPage'));
const Rates360Table = React.lazy(
  () => import('@/entities/rates/ui/Rates360Table/Rates360Table'),
);
const Rate360MeList = React.lazy(
  () => import('@/pages/Rate360MeList/Rate360MeList'),
);
const Report360 = React.lazy(() => import('@/pages/Report360/index'));
const Skills = React.lazy(() => import('@/pages/Skills/ui/Skills'));
const Progress = React.lazy(() => import('@/pages/Progress/Progress'));
const IprEditPage = React.lazy(() => import('@/pages/IprEditPage/IprEditPage'));
const IprListPage = React.lazy(
  () => import('@/widgets/IprListPage/IprListPage'),
);
const Board = React.lazy(() => import('@/pages/Board/BoardPage'));
const AdminBoard = React.lazy(() => import('@/pages/AdminBoard/AdminBoard'));
const SkillsHistory = React.lazy(
  () => import('@/pages/SkillsHistory/SkillsHistory'),
);
const SkillsHistoryElement = React.lazy(
  () => import('@/pages/SkillsHistoryElement/SkillsHistoryElement'),
);
const Tests = React.lazy(() => import('@/pages/Tests/Tests'));
const TestCreate = React.lazy(() => import('@/pages/TestCreate/TestCreate'));
const TestAssesment = React.lazy(
  () => import('@/pages/TestAssesment/TestAssesment'),
);
const TestEdit = React.lazy(() => import('@/pages/TestEdit/TestEdit'));
const FinishedTest = React.lazy(
  () => import('@/pages/FinishedTest/FinishedTest'),
);
const AssignedTests = React.lazy(
  () => import('@/pages/AssignedTests/AssignedTests'),
);
const Surveys = React.lazy(() => import('@/pages/Surveys/Surveys'));
const SurveyCreate = React.lazy(
  () => import('@/pages/SurveyCreate/SurveyCreate'),
);
const SurveyEdit = React.lazy(() => import('@/pages/SurveyEdit/SurveyEdit'));
const FinishedSurvey = React.lazy(
  () => import('@/pages/FinishedSurvey/FinishedSurvey'),
);
const AssignedSurveys = React.lazy(
  () => import('@/pages/AssignedSurveys/AssignedSurveys'),
);
const SurveyAssesment = React.lazy(
  () => import('@/pages/SurveyAssesment/SurveyAssesment'),
);
const IprUser = React.lazy(() => import('@/pages/IprUser/IprUser'));
const IprMeList = React.lazy(() => import('@/pages/IprMeList/IprMeList'));
const Rate360Assesment = React.lazy(
  () => import('@/pages/Rate360Assesment/Rate360Assesment'),
);
const SurvyeResult = React.lazy(
  () => import('@/pages/SurveyResult/SurveyResult'),
);
const Support = React.lazy(() => import('@/pages/Support/Support'));
const SupportAdmin = React.lazy(
  () => import('@/pages/SupportAdmin/SupportAdmin'),
);
const SupportOverview = React.lazy(
  () => import('@/pages/SupportOverview/SupportOverview'),
);

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
  { path: '/teams', element: <Teams />, onlyAdmin: true, curator: true },
  { path: '/teams/:id', element: <TeamPage />, onlyAdmin: true, curator: true },
  {
    path: '/360rate',
    element: <Rates360Table type="ALL" />,
    onlyAdmin: true,
    curator: true,
  },
  {
    path: '/360rate-team',
    element: <Rates360Table type="TEAM" />,
    onlyAdmin: true,
    curator: true,
  },
  { path: '/360rate/me', element: <Rate360MeList /> },
  {
    path: '/360rate/report/:id',
    element: <Report360 />,
  },
  { path: '/skills', element: <Skills />, onlyAdmin: true },
  { path: '/profile', element: <Profile /> },
  { path: '/progress', element: <Progress /> },
  { path: '/progress/:id', element: <Rate360Assesment /> },
  { path: '/', element: <Profile /> },
  { path: '/ipr/360/:rateId', element: <IprEditPage /> },
  { path: '/board', element: <Board /> },
  { path: '/board/:userId', element: <AdminBoard /> },
  {
    path: '/ipr',
    element: <IprListPage type="ALL" />,
    onlyAdmin: true,
    curator: true,
  },
  {
    path: '/ipr-team',
    element: <IprListPage type="TEAM" />,
    onlyAdmin: true,
    curator: true,
  },
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
  {
    path: '/ipr/user/:id',
    element: <IprUser />,
  },
  {
    path: '/ipr/me',
    element: <IprMeList />,
  },
  { path: '/360rate/me', element: <Rate360MeList /> },
  { path: '/surveys/results/:id', element: <SurvyeResult /> },
  { path: '/support', element: <Support /> },
  { path: '/support-admin', element: <SupportAdmin />, onlyAdmin: true },
  { path: '/support/:id', element: <SupportOverview /> },
];

export const guestRoutes = ['/login', '/invite', '/reset-password'];
