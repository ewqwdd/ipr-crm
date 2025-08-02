import { userAtom } from "@/atoms/userAtom";
import { $api } from "@/shared/lib/$api";
import SoftButton from "@/shared/ui/SoftButton";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function NotificationsList() {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.notifications.some((item) => !item.watched)) {
      $api.post("/notification/read", {
        ids: user.notifications.map((item) => item.id),
      });
      setUser((prev) =>
        prev
          ? {
              ...prev,
              notifications: prev?.notifications.map((item) => ({
                ...item,
                watched: true,
              })),
            }
          : null,
      );
    }
  }, [user, setUser]);

  return (
    user &&
    user.notifications.map((item) => (
      <div
        key={item.id}
        className="py-5 first:pt-0 last:pb-0 flex flex-col gap-1 border-b border-b-[#5592ED] last:border-0"
      >
        <h2 className="text-white">{item.title}</h2>
        <p className="text-sm text-white">{item.description}</p>
        {item.url && (
          <SoftButton
            className="self-start mt-2"
            onClick={() => navigate(item.url!)}
            variant="teritary"
          >
            Перейти
          </SoftButton>
        )}
      </div>
    ))
  );
}
