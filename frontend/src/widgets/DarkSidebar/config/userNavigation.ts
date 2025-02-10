import { HomeIcon, InboxIcon } from "@heroicons/react/outline";
import { NavType } from "./types";

  
  export const userNavigation: NavType[] = [
    { name: 'Главная', icon: HomeIcon, href: '/', current: true },
    {
      name: 'Мне назначено',
      icon: InboxIcon,
      current: false,
      children: [{ name: 'Оценка 360', href: '/progress', current: false }],
    },

  ];