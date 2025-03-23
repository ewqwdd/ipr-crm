import {
  ChartBarIcon,
  HomeIcon,
  InboxIcon,
  MapIcon,
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
        count: user?.notifications.filter((n) => types360.includes(n.type))
          .length,
      },
    ],
  },
  {
    name: 'Доска задач',
    icon: MapIcon,
    current: false,
    href: '/board',
    count: user?.notifications.filter((n) => typesTasks.includes(n.type))
      .length,
  },
  ...((user?.teamCurator?.length ?? 0) > 0
    ? [
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
      ]
    : []),
];
