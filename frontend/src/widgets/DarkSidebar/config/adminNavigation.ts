import {
  ChartBarIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import { NavType, types360, typesTasks } from './types';
import { User } from '@/entities/user';

export const adminNavigation: (user: User | null) => NavType[] = (user) => [
  { name: 'Дашборд', icon: HomeIcon, href: '/' },
  {
    name: 'Доска задач',
    icon: MapIcon,
    href: '/board',
    count: user?.notifications.filter((n) => typesTasks.includes(n.type))
      .length,
  },
  {
    name: 'Мне назначено',
    icon: InboxIcon,
    children: [
      {
        name: 'Оценка 360',
        href: '/progress',
        count: user?.notifications.filter((n) => types360.includes(n.type))
          .length,
      },
    ],
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
  {
    name: 'Тесты',
    icon: QuestionMarkCircleIcon,
    href: '/tests',
  },
];
