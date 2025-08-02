import { cva } from "@/shared/lib/cva";
import {
  type FunctionComponent,
  type ReactNode,
  type SVGProps,
  type ButtonHTMLAttributes,
} from "react";
import { motion } from "framer-motion";
import NotificationWrapper from "../NotificationWrapper";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  notificationValue?: number;
  children: ReactNode;
  isActive?: boolean;
}

export default function IconButton({
  Icon,
  notificationValue,
  children,
  className,
  isActive = false,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cva(
        "gap-2 flex items-center h-14 px-4 relative transition-colors duration-200 rounded-[999px] font-extrabold cursor-pointer",
        { "text-white": isActive },
        className,
      )}
      {...props}
      type={props.type || "button"}
    >
      <motion.div
        className="absolute inset-0 bg-primary rounded-[999px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.8,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
      />
      <div className="relative z-10 flex items-center gap-2">
        <NotificationWrapper value={notificationValue}>
          <Icon className="size-6" />
        </NotificationWrapper>
        {children}
      </div>
    </button>
  );
}
