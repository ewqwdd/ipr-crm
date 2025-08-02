import { userAtom } from "@/atoms/userAtom";
import { useRatesCounter } from "@/shared/hooks/ratesCounter";
import Avatar from "@/shared/ui/Avatar";
import NotificationWrapper from "@/shared/ui/NotificationWrapper";
import { useAtomValue } from "jotai";
import Icon360 from "@/shared/icons/360.svg";
import Tasks from "@/shared/icons/Tasks.svg";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { cva } from "@/shared/lib/cva";
import { useIsOnPage } from "@/shared/hooks/useIsOnPage";

const navLinks = [
  {
    label: "Оценка 360",
    Icon: () => {
      const count = useRatesCounter();
      return (
        <NotificationWrapper value={count}>
          <Icon360 className="size-7 min-w-7" />
        </NotificationWrapper>
      );
    },
    link: "/my-rates",
  },
  {
    label: "Задачи",
    Icon: () => {
      return <Tasks className="size-7 min-w-7" />;
    },
    link: "/plans",
  },
  {
    label: "Профиль",
    Icon: () => {
      const user = useAtomValue(userAtom);
      return <Avatar className="size-8 min-w-8" src={user?.avatar} />;
    },
    link: "/",
  },
];

export default function NavbarMobile() {
  const location = useLocation();
  const navigate = useNavigate();
  const isBlocked = useIsOnPage(["support"]);

  if (isBlocked) return null;

  return (
    <>
      <nav className="bottom-5 fixed left-1/2 -translate-x-1/2 p-1 rounded-full bg-primary flex z-10">
        {navLinks.map(({ label, Icon, link }) => {
          const isActive =
            link === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(link);

          return (
            <motion.button
              whileTap={{ scale: 0.9 }}
              key={link}
              className={cva(
                "flex px-4 h-14 rounded-full items-center justify-center gap-1.5 text-sm font-extrabold text-teritary",
                {
                  "text-primary pr-5 bg-white": isActive,
                },
              )}
              onClick={() => navigate(link)}
              animate={{ maxWidth: isActive ? "190px" : "64px" }}
              initial={{ maxWidth: "64px" }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            >
              <Icon />
              <span
                className={cva("whitespace-nowrap", {
                  hidden: !isActive,
                })}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </>
  );
}
