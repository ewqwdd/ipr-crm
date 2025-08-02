import SoftButton from "@/shared/ui/SoftButton";
import Go from "@/shared/icons/Go.svg";
import { useNavigate } from "react-router";
import type { HTMLMotionProps } from "framer-motion";

interface BoardLinkProps extends HTMLMotionProps<"button"> {
  url?: string;
}

export default function BoardLink({
  url = "/board",
  ...props
}: BoardLinkProps) {
  const navigate = useNavigate();
  return (
    <SoftButton onClick={() => navigate(url)} {...props}>
      Доска задач
      <Go className="size-4" />
    </SoftButton>
  );
}
