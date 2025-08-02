import { userAtom } from "@/atoms/userAtom";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import UserDetails from "@/widgets/UserDetails";
import { useAtom } from "jotai";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import UserEdit from "@/widgets/UserEdit";
import type { UserFormData } from "@/shared/types/User";
import { $api } from "@/shared/lib/$api";
import toast from "react-hot-toast";
import Card from "@/shared/ui/Card";
import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import SoftButton from "@/shared/ui/SoftButton";
import { useNavigate } from "react-router";

export default function Home() {
  const [user, setUser] = useAtom(userAtom);
  const [tab, setTab] = useState<"profile" | "edit">("profile");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const onSubmit = async (data: UserFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    setLoading(true);
    try {
      const { data } = await $api.put("/users/me", formData);
      setUser((prev) => ({
        ...prev!,
        ...data,
      }));
      setTab("profile");
    } catch (error) {
      console.log(error);
      toast.error("Ошибка редактирования");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    $api.post("/auth/sign-out").then(() => {
      setUser(null);
    });
  };

  const details = isMobile ? (
    <div className="p-5">
      <UserDetails
        user={user}
        onEdit={() => setTab("edit")}
        headerButtons={
          <div className="flex flex-col gap-3 items-end ml-auto">
            <SoftButton variant="error" onClick={handleLogout}>
              Выйти
            </SoftButton>
            <SoftButton variant="teritary" onClick={() => navigate("/support")}>
              Поддержка
            </SoftButton>
          </div>
        }
      />
    </div>
  ) : (
    <Card>
      <UserDetails user={user} onEdit={() => setTab("edit")} />
    </Card>
  );

  const edit = isMobile ? (
    <div className="p-5">
      <UserEdit
        user={user}
        onSubmit={onSubmit}
        loading={loading}
        onCancel={() => setTab("profile")}
      />
    </div>
  ) : (
    <Card>
      <UserEdit
        user={user}
        onSubmit={onSubmit}
        loading={loading}
        onCancel={() => setTab("profile")}
      />
    </Card>
  );

  return (
    <AnimationWrapper.ScaleOpacity>
      <AnimatePresence mode="wait">
        {tab === "profile" && (
          <AnimationWrapper.Opacity key="details">
            {details}
          </AnimationWrapper.Opacity>
        )}
        {tab === "edit" && (
          <AnimationWrapper.Opacity key="edit">{edit}</AnimationWrapper.Opacity>
        )}
      </AnimatePresence>
    </AnimationWrapper.ScaleOpacity>
  );
}
