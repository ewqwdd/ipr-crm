import type { FunctionComponent, SVGProps } from "react";
import Home from "@/shared/icons/Home.svg";
import Goal from "@/shared/icons/Goal.svg";
import Tasks from "@/shared/icons/Tasks.svg";
import Road from "@/shared/icons/Road.svg";
import Grade from "@/shared/icons/Grade.svg";
import Support from "@/shared/icons/Support.svg";
import RateNotifications from "@/widgets/RateNotifications";

interface SidebarItem {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  label: string;
  link: string;
  notifications?: () => number | null;
}

export const sidebarConfig: SidebarItem[] = [
  {
    icon: Home,
    label: "Главная",
    link: "/",
  },
  {
    icon: Goal,
    label: "Мне назначено",
    link: "/assigned",
    notifications: RateNotifications,
  },
  {
    icon: Tasks,
    label: "Доска задач",
    link: "/board",
  },
  {
    icon: Road,
    label: "Мои планы развития",
    link: "/plans",
  },
  {
    icon: Grade,
    label: "Мои оценки 360",
    link: "/my-rates",
  },
  {
    icon: Support,
    label: "Поддержка",
    link: "/support",
  },
];
