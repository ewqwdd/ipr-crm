import { Link } from "react-router";
import IconButton from "@/shared/ui/IconButton";
import Logout from "@/shared/icons/Logout.svg";
import { $api } from "@/shared/lib/$api";
import { useSetAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import NotificationDropdown from "@/widgets/NotificationDropdown";
import Logo from "@/shared/icons/logo.svg";

export default function Navbar() {
  const setUser = useSetAtom(userAtom);

  const handleLogout = () => {
    $api.post("/auth/sign-out").then(() => {
      setUser(null);
    });
  };

  return (
    <nav className="flex justify-between h-14 mt-7">
      <div className="flex items-center max-w-60 flex-1 justify-between">
        <Link
          to="/"
          className="text-3xl font-extrabold h-14 gap-3 flex items-center pl-4 pr-5 text-accent"
        >
          <Logo className="h-10" />
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
