import { cva } from "@/shared/lib/cva";

interface NotificationWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  value?: React.ReactNode;
}

export default function NotificationWrapper({
  children,
  value,
  className,
  ...props
}: NotificationWrapperProps) {
  return (
    <div className={cva("relative", className)} {...props}>
      {children}
      {!!value && (
        <figure className="rounded-full bg-error border-2 flex items-center justify-center border-white text-white text-xs font-extrabold size-5 absolute -top-2 -right-2">
          {value}
        </figure>
      )}
    </div>
  );
}
