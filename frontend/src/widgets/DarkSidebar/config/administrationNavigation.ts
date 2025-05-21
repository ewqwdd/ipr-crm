import {
  ChartBarIcon,
  ChatAltIcon,
  ClipboardListIcon,
  DocumentIcon,
  FolderIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/outline';

export const administrationNavigation = (type: 'admin' | 'curator') => [
  {
    name: 'Администрирование',
  },
  ...(type === 'admin'
    ? [
        {
          name: 'Сотрудники',
          icon: UserIcon,
          children: [
            { name: 'Сотрудники', href: '/users' },
            {
              name: 'Организационная структура',
              href: '/structure',
            },
          ],
        },
      ]
    : []),
  { name: 'Команды', icon: UsersIcon, href: '/teams' },
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
  ...(type === 'admin'
    ? [
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
      ]
    : []),
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
  ...(type === 'admin'
    ? [
        {
          name: 'Обращения в поддержку',
          icon: ChatAltIcon,
          href: '/support-admin',
        },
      ]
    : []),
];
