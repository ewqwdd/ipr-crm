import {
  ChartBarIcon,
  HomeIcon,
  InboxInIcon,
  MapIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline';
import { NavType, typesTasks } from './types';
import { User } from '@/entities/user';
import { administrationNavigation } from './administrationNavigation';
import { assignedNavigation } from './assignedNavigation';

export const userNavigation: (user: User | null) => NavType[] = (
  user: User | null,
) => {
  return [
    { name: 'Главная', icon: HomeIcon, href: '/', current: true },
    ...assignedNavigation,
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
      name: 'Поддержка',
      icon: QuestionMarkCircleIcon,
      href: '/support',
    },

    ...((user?.teamCurator?.length ?? 0) > 0
      ? administrationNavigation('curator')
      : []),
  ];
};
