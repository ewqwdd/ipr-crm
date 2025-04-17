import {
  ChartBarIcon,
  ClipboardListIcon,
  HomeIcon,
  InboxIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import { NavType, types360, typesTasks } from './types';
import { User } from '@/entities/user';

export const userNavigation: (user: User | null) => NavType[] = (
  user: User | null,
) => [
  { name: 'Главная', icon: HomeIcon, href: '/', current: true },
  {
    name: 'Мне назначено',
    icon: InboxIcon,
    current: false,
    children: [
      {
        name: 'Оценка 360',
        href: '/progress',
        current: false,
        count: user?.notifications.filter(
          (n) => types360.includes(n.type) && !n.watched,
        ).length,
      },
      {
        name: 'Тесты',
        href: '/assigned-tests',
        icon: QuestionMarkCircleIcon,
        count: user?.notifications.filter(
          (n) => n.type === 'TEST_ASSIGNED' && !n.watched,
        ).length,
      },
      {
        name: 'Опросы',
        href: '/assigned-surveys',
        icon: ClipboardListIcon,
        count: user?.notifications.filter(
          (n) => n.type === 'SURVEY_ASSIGNED' && !n.watched,
        ).length,
      },
    ],
  },
  {
    name: 'Доска задач',
    icon: MapIcon,
    current: false,
    href: '/board',
    count: user?.notifications.filter(
      (n) => typesTasks.includes(n.type) && !n.watched,
    ).length,
  },
  ...((user?.teamCurator?.length ?? 0) > 0
    ? [
        { name: 'Команды', icon: UsersIcon, href: '/teams' },
        {
          name: 'Планы развития',
          icon: ChartBarIcon,
          current: false,
          href: '/ipr',
        },
        {
          name: 'Оценка',
          icon: InboxIcon,
          current: false,
          children: [{ name: 'Оценка 360', href: '/360rate', current: false }],
        },
        {
          name: 'Тесты',
          icon: QuestionMarkCircleIcon,
          href: '/tests',
        },
        {
          name: 'Опросы',
          icon: ClipboardListIcon,
          href: '/surveys',
        },
      ]
    : []),
];
