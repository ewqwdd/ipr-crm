import {
  ChartBarIcon,
  ChatAltIcon,
  ClipboardListIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
} from '@heroicons/react/outline';

export const administrationNavigation = [
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
  {
    name: 'Обращения в поддержку',
    icon: ChatAltIcon,
    href: '/support-admin',
  },
];
