import { cva } from '@/shared/lib/cva';
import { useState } from 'react';
import styles from './Overlay.module.css';

interface OverlayProps {
  children: React.ReactNode;
  overlay: React.ReactNode;
  className?: string;
}

export default function Overlay({
  children,
  overlay,
  className,
}: OverlayProps) {
  const [active, setActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cva('relative', className)}
    >
      {active && (
        <div
          className={cva(
            'absolute bottom-1/2 left-full bg-indigo-50/50 shadow-sm text-indigo-500 rounded-md whitespace-nowrap py-0.5 px-1',
            styles.open,
          )}
        >
          {overlay}
        </div>
      )}
      {children}
    </div>
  );
}
