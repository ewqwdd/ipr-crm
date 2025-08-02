import { Link } from "react-router";
import IconButton from "@/shared/ui/IconButton";
import Logout from "@/shared/icons/Logout.svg";
import { $api } from "@/shared/lib/$api";
import { useSetAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import NotificationDropdown from "@/widgets/NotificationDropdown";

export default function Navbar() {
  const setUser = useSetAtom(userAtom);

  const handleLogout = () => {
    $api.post("/auth/sign-out").then(() => {
      setUser(null);
    });
  };

  return (
    <nav className="flex justify-between h-14 mt-7">
      <div className="flex items-center gap-[58px]">
        <Link to="/" className="text-3xl font-extrabold py-3 pl-3 pr-4">
          Skills.
        </Link>
        <NotificationDropdown />
      </div>
      <IconButton Icon={Logout} onClick={handleLogout}>
        Выйти
      </IconButton>
    </nav>
  );
}
