import {
  ChartBarIcon,
  DocumentIcon,
  HomeIcon,
  InboxIcon,
  MapIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import { NavType } from './types';

export const adminNavigation: NavType[] = [
  { name: 'Dashboard', icon: HomeIcon, href: '/', current: true },
  { name: 'Users', icon: UserIcon, href: '/users', current: false },
  {
    name: 'Орагнизационная структура',
    icon: UsersIcon,
    href: '/structure',
    current: false,
  },
  { name: 'Команды', icon: UsersIcon, href: '/teams', current: false },
  {
    name: 'Оценка',
    icon: InboxIcon,
    current: false,
    children: [{ name: 'Оценка 360', href: '/360rate', current: false }],
  },
  {
    name: 'Планы развития',
    icon: ChartBarIcon,
    current: false,
    href: '/ipr',
  },
  {
    name: 'Конструктор профилей',
    icon: DocumentIcon,
    href: '/skills',
    current: false,
  },
  {
    name: 'Доска задач',
    icon: MapIcon,
    current: false,
    href: '/board',
  },
  {
    name: 'Мне назначено',
    icon: InboxIcon,
    current: false,
    children: [{ name: 'Оценка 360', href: '/progress', current: false }],
  },
];
