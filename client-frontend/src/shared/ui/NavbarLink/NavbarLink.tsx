import { cva } from "@/shared/lib/cva";
import { type FunctionComponent, type ReactNode, type SVGProps } from "react";
import { NavLink, type NavLinkProps } from "react-router";
import { motion } from "framer-motion";
import NotificationWrapper from "../NotificationWrapper";

interface NavbarLinkProps extends NavLinkProps {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  notificationValue?: ReactNode;
  children: ReactNode;
}

export default function NavbarLink({
  Icon,
  notificationValue,
  children,
  to,
  className,
  ...props
}: NavbarLinkProps) {
  return (
    <NavLink
      className={(params) =>
        cva(
          "gap-2 flex items-center h-14 px-4 relative transition-colors duration-200 rounded-[999px] font-extrabold",
          { "text-white": params.isActive },
          typeof className === "function" ? className(params) : className,
        )
      }
      {...props}
      to={to}
    >
      {({ isActive, isPending }) => (
        <>
          <motion.div
            className="absolute inset-0 bg-primary rounded-[999px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isActive || isPending ? 1 : 0,
              scale: isActive || isPending ? 1 : 0.8,
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
        </>
      )}
    </NavLink>
  );
}
