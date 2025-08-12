import Login from '@/pages/Login/Login';
import { RouterItemType } from './types';
import { ResetPassword } from '@/pages/ResetPassword';
import { Profile } from '@/pages/Profile';
import React from 'react';
import { AssignedCase } from '@/pages/AssignedCase';
import { MyCaseRates } from '@/pages/MyCaseRates';

const UserPage = React.lazy(() => import('@/pages/UserPage/UserPage'));
const Users = React.lazy(() => import('@/pages/Users/Users'));
const UserEdit = React.lazy(() => import('@/pages/UserEdit/UserEdit'));
const ProfileEdit = React.lazy(() => import('@/pages/ProfileEdit/ProfileEdit'));
const AddUser = React.lazy(() => import('@/pages/AddUser/AddUser'));
const Structure = React.lazy(() => import('@/pages/Structure/Structure'));
const Teams = React.lazy(() => import('@/pages/Teams/Teams'));
const TeamPage = React.lazy(() => import('@/pages/TeamPage/TeamPage'));
const Rates360TablePage = React.lazy(
  () => import('@/features/Rates360TablePage/Rates360TablePage'),
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
const Rate360Statistic = React.lazy(
  () => import('@/pages/Rate360Statistic/Rate360Statistic'),
);
const RateSubbordinates = React.lazy(
  () => import('@/pages/RatesSubbordinates/RatesSubbordinates'),
);
const Cases = React.lazy(() => import('@/pages/Cases/Cases'));
const CaseRates = React.lazy(() => import('@/pages/CaseRates/CaseRates'));
const AssignedCases = React.lazy(
  () => import('@/pages/AssignedCases/AssignedCases'),
);
const CaseReport = React.lazy(() => import('@/pages/CaseReport/CaseReport'));

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
  { path: '/teams/:id', element: <TeamPage /> },
  {
    path: '/360rate',
    element: <Rates360TablePage key="ALL" type="ALL" />,
    onlyAdmin: true,
    curator: true,
  },
  {
    path: '/360rate-team',
    element: <Rates360TablePage key="TEAM" type="TEAM" />,
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
  {
    path: '/rate-statistics',
    element: <Rate360Statistic />,
    curator: true,
    onlyAdmin: true,
  },
  {
    path: '/rate-subordinates',
    element: <RateSubbordinates />,
    curator: true,
  },
  {
    path: '/cases',
    element: <Cases />,
    onlyAdmin: true,
  },
  {
    path: '/case-rates',
    element: <CaseRates />,
    onlyAdmin: true,
    curator: true,
  },
  {
    path: '/assigned-cases',
    element: <AssignedCases />,
  },
  {
    path: '/assigned-cases/:id',
    element: <AssignedCase />,
  },
  {
    path: '/case-report/:id',
    element: <CaseReport />,
  },
  {
    path: '/my-cases',
    element: <MyCaseRates />,
  },
];

export const guestRoutes = ['/login', '/invite', '/reset-password'];
