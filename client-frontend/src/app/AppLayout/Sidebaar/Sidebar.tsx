import NavbarLink from "@/shared/ui/NavbarLink";
import { sidebarConfig } from "./sidebarConfig";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import Avatar from "@/shared/ui/Avatar";
import { generalService } from "@/shared/lib/services/generalService";
import { memo } from "react";
import { useIsOnPage } from "@/shared/hooks/useIsOnPage";

export default memo(function Sidebar() {
  const user = useAtomValue(userAtom);

  const isSidebarDisabled = useIsOnPage([
    "/login",
    "/forgot-password",
    "/reset-password",
    "/invite",
    "/link-sent",
    "/report/:id",
  ]);

  const notifications = sidebarConfig.map((item) => item.notifications?.());

  if (isSidebarDisabled) return null;

  return (
    <aside className="flex items-start w-60 flex-col sticky top-3">
      {sidebarConfig.map((item, i) => (
        <NavbarLink
          Icon={item.icon}
          to={item.link}
          key={item.label}
          notificationValue={notifications[i]}
        >
          {item.label}
        </NavbarLink>
      ))}
      <NavbarLink
        className="mt-2 min-w-32"
        avatar={
          <Avatar
            src={generalService.transformFileUrl(user?.avatar)}
            alt="user avatar"
          />
        }
        to={"/profile"}
      >
        {user?.username}
      </NavbarLink>
    </aside>
  );
});
