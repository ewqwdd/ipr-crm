import MessageIcon from "@/shared/icons/MessageIcon.svg";
import { cva } from "@/shared/lib/cva";
import Dropdown from "@/shared/ui/Dropdown";
import NotificationWrapper from "@/shared/ui/NotificationWrapper";
import { memo } from "react";
import NotificationsList from "./NotificationsList";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/userAtom";

export default memo(function NotificationDropdown() {
  const user = useAtomValue(userAtom);
  const unread =
    user?.notifications.reduce(
      (acc, item) => (item.watched ? acc : acc + 1),
      0,
    ) ?? 0;

  return (
    <Dropdown
      disabled={!user?.notifications.length}
      className={"font-extrabold"}
      dropdownClassName="w-[25rem] bg-accent"
      button={(isActive) => (
        <div className="size-14 flex items-center justify-center cursor-pointer">
          <NotificationWrapper value={unread > 0 ? unread : undefined}>
            <MessageIcon
              className={cva("size-6 transition-all", {
                "text-accent": isActive,
              })}
            />
          </NotificationWrapper>
        </div>
      )}
    >
      <NotificationsList />
    </Dropdown>
  );
});
