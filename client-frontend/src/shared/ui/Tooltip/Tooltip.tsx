import { type FC, type ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Position = "top" | "bottom";
type Alignment = "left" | "center" | "right";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: Position;
  align?: Alignment;
  className?: string;
  contentClassName?: string;
  arrow?: boolean;
}

const getPositionClasses = (position: Position, align: Alignment) => {
  const baseClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
  };

  const alignClasses = {
    left: {
      top: "left-[calc(0%-0.5rem)]",
      bottom: "left-[calc(0%-0.5rem)]",
    },
    center: {
      top: "left-1/2 -translate-x-1/2",
      bottom: "left-1/2 -translate-x-1/2",
    },
    right: {
      top: "right-[calc(0%-0.5rem)]",
      bottom: "right-[calc(0%-0.5rem)]",
    },
  };

  return `${baseClasses[position]} ${alignClasses[align][position]}`;
};

const getArrowPosition = (position: Position, align: Alignment) => {
  const positions = {
    top: {
      left: "left-[1rem]",
      center: "left-1/2 -translate-x-1/2",
      right: "right-[1rem]",
    },
    bottom: {
      left: "left-[1rem]",
      center: "left-1/2 -translate-x-1/2",
      right: "right-[1rem]",
    },
  };

  return positions[position][align];
};

const getArrowClasses = (position: Position, align: Alignment) => {
  const baseClasses = {
    top: "bottom-[-4px] -translate-x-1/2",
    bottom: "top-[-4px] -translate-x-1/2",
  };

  return `absolute h-2 w-2 rotate-45 bg-primary ${baseClasses[position]} ${getArrowPosition(position, align)}`;
};

const getAnimationVariants = (position: Position) => {
  const yOffset = position === "top" ? 4 : -4;

  return {
    initial: {
      opacity: 0,
      y: yOffset,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: yOffset,
      scale: 0.95,
    },
  };
};

const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  align = "center",
  className,
  contentClassName,
  arrow,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative inline-block ${className || ""}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute z-10 w-max max-w-xs rounded-lg bg-primary px-3 py-2 text-sm text-white pointer-events-none ${getPositionClasses(position, align)} ${contentClassName || ""}`}
            variants={getAnimationVariants(position)}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1], // easeOut
            }}
          >
            {content}
            {arrow && (
              <motion.div
                className={getArrowClasses(position, align)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.05 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
