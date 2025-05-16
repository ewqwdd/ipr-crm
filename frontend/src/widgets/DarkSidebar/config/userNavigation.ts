import {
  ChartBarIcon,
  ClipboardListIcon,
  HomeIcon,
  InboxIcon,
  InboxInIcon,
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
    href: '/board',
    count: user?.notifications.filter(
      (n) => typesTasks.includes(n.type) && !n.watched,
    ).length,
  },
  {
    name: 'Мои планы развития',
    icon: ChartBarIcon,
    href: '/ipr/me',
  },
  {
    name: 'Мои оценки 360',
    icon: InboxInIcon,
    href: '/360rate/me',
  },

  ...((user?.teamCurator?.length ?? 0) > 0
    ? [
        {
          name: 'Администрирование',
        },
        { name: 'Команды', icon: UsersIcon, href: '/teams' },
        {
          name: 'Планы развития',
          icon: ChartBarIcon,
          children: [
            {
              name: 'Все планы',
              href: '/ipr',
            },
            {
              name: 'Планы команды',
              href: '/ipr-team',
            },
          ],
        },
        {
          name: 'Оценка 360',
          icon: InboxIcon,
          children: [
            {
              name: 'Все оценки',
              href: '/360rate',
            },
            {
              name: 'Оценки команды',
              href: '/360rate-team',
            },
          ],
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
