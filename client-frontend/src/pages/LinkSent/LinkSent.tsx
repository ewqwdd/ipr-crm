import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import SoftButton from "@/shared/ui/SoftButton";
import { useLocation, useNavigate } from "react-router";
import Go from "@/shared/icons/Go.svg";

export default function LinkSent() {
  const location = useLocation();
  const state = location.state as { email?: string } | null;
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center font-extrabold bg-accent text-center text-white">
      <h1 className="text-3xl">Skills.</h1>
      <p className="mt-3 max-w-80">
        Ссылка была отправлена на почту {state?.email}
      </p>
      {isMobile && (
        <SoftButton
          variant="clean"
          className="mt-5"
          onClick={() => navigate("/login")}
        >
          <Go className="rotate-180" />
          Вернуться назад
        </SoftButton>
      )}
    </main>
  );
}
