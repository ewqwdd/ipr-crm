import { cva } from '@/shared/lib/cva';

interface AvatarProps {
  src?: string;
  className?: string;
}

export default function Avatar({ src, className }: AvatarProps) {
  return (
    <span
      className={cva(
        'inline-block h-6 w-6 rounded-full overflow-hidden bg-gray-100',
        className,
      )}
    >
      {src ? (
        <img src={src} className="size-full object-cover" />
      ) : (
        <svg
          className="h-full w-full text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </span>
  );
}
