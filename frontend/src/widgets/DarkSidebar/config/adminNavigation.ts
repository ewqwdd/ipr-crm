import {
  ChartBarIcon,
  ClipboardListIcon,
  HomeIcon,
  InboxIcon,
  InboxInIcon,
  MapIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline';
import { NavType, types360, typesTasks } from './types';
import { User } from '@/entities/user';
import { administrationNavigation } from './administrationNavigation';

export const adminNavigation: (user: User | null) => NavType[] = (user) => [
  { name: 'Дашборд', icon: HomeIcon, href: '/' },
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
  {
    name: 'Мне назначено',
    icon: InboxIcon,
    children: [
      {
        name: 'Оценка 360',
        href: '/progress',
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
    name: 'Поддержка',
    icon: QuestionMarkCircleIcon,
    href: '/support',
  },
  ...administrationNavigation('admin'),
];
