import NavbarLink from "@/shared/ui/NavbarLink";
import { sidebarConfig } from "./sidebarConfig";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import Avatar from "@/shared/ui/Avatar";
import { Link } from "react-router";
import { generalService } from "@/shared/lib/services/generalService";

export default function Sidebar() {
  const user = useAtomValue(userAtom);

  return (
    <aside className="flex items-start w-60 flex-col sticky top-3">
      {sidebarConfig.map((item) => (
        <NavbarLink
          Icon={item.icon}
          to={item.link}
          key={item.label}
          notificationValue={item.notifications?.()}
        >
          {item.label}
        </NavbarLink>
      ))}
      <Link
        to="/"
        className="pl-4 pr-5 h-14 flex items-center gap-2 font-extrabold text-sm mt-2"
      >
        <Avatar
          src={generalService.transformFileUrl(user?.avatar)}
          alt="user avatar"
        />
        {user?.username}
      </Link>
    </aside>
  );
}
