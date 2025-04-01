import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface PortalWithPositionProps {
  targetRef: React.RefObject<HTMLElement>;
  childrenRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

const DropdownPadding = 8;

export default function PortalWithPosition({
  targetRef,
  childrenRef,
  children,
}: PortalWithPositionProps) {
  const [styles, setStyles] = useState<React.CSSProperties>({
    opacity: 0,
  });
  const portalRoot = document.getElementById('portal-root');

  useEffect(() => {
    if (!targetRef.current || !childrenRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const contentRect = childrenRef.current.getBoundingClientRect();

    let top = targetRect.bottom + window.scrollY + DropdownPadding;
    let left = targetRect.right - contentRect.width + window.scrollX;

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    if (top + contentRect.height > viewportHeight) {
      top =
        targetRect.top - contentRect.height + window.scrollY - DropdownPadding;
    }

    if (left + contentRect.width > viewportWidth) {
      left = viewportWidth - contentRect.width;
    }

    if (left < 0) {
      left = 0;
    }

    setStyles({
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 50,
      opacity: 1,
      transition: 'opacity 0.2s ease',
    });
  }, [targetRef, childrenRef]);

  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div style={styles}>{children}</div>,
    portalRoot,
  );
}
