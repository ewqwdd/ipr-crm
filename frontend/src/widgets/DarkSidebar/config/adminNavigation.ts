import {
  ChartBarIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MapIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import { NavType } from './types';

export const adminNavigation: NavType[] = [
  { name: 'Дашборд', icon: HomeIcon, href: '/' },
  {
    name: 'Доска задач',
    icon: MapIcon,
    href: '/board',
  },
  {
    name: 'Мне назначено',
    icon: InboxIcon,
    children: [{ name: 'Оценка 360', href: '/progress' }],
  },
  {
    name: 'Администрирование',
  },
  {
    name: 'Сотрудники',
    icon: UserIcon,
    children: [
      { name: 'Сотрудники', href: '/users' },
      {
        name: 'Орагнизационная структура',
        href: '/structure',
      },
    ],
  },

  { name: 'Команды', icon: UsersIcon, href: '/teams' },
  {
    name: 'Оценка',
    icon: InboxIcon,
    children: [{ name: 'Оценка 360', href: '/360rate' }],
  },
  {
    name: 'Планы развития',
    icon: ChartBarIcon,
    href: '/ipr',
  },
  {
    name: 'Конструктор профилей',
    icon: DocumentIcon,
    href: '/skills',
  },
  {
    name: 'История версий',
    icon: FolderIcon,
    href: '/skills/history',
  },
];
