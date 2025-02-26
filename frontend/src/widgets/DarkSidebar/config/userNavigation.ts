import {
  ChartBarIcon,
  HomeIcon,
  InboxIcon,
  MapIcon,
} from '@heroicons/react/outline';
import { NavType } from './types';
import { User } from '@/entities/user';

export const userNavigation: (user: User | null) => NavType[] = (
  user: User | null,
) => [
  { name: 'Главная', icon: HomeIcon, href: '/', current: true },
  {
    name: 'Мне назначено',
    icon: InboxIcon,
    current: false,
    children: [{ name: 'Оценка 360', href: '/progress', current: false }],
  },
  {
    name: 'Доска задач',
    icon: MapIcon,
    current: false,
    href: '/board',
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
