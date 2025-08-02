import { motion } from "framer-motion";

interface AnimationWrapperProps {
  children: React.ReactNode;
  delay?: number;
  exit?: boolean;
}

const AnimationWrapper = {
  ScaleOpacity: ({ children, delay, exit = true }: AnimationWrapperProps) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={
          !exit
            ? undefined
            : {
                opacity: 0,
                scale: 0.95,
                transition: {
                  duration: 0.075,
                },
              }
        }
        transition={{ type: "spring", stiffness: 450, damping: 40, delay }}
        className="min-h-2/3"
      >
        {children}
      </motion.div>
    );
  },

  Opacity: ({ children, delay, exit = true }: AnimationWrapperProps) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={!exit ? undefined : { opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 450, damping: 40, delay }}
      >
        {children}
      </motion.div>
    );
  },

  Right: ({ children, delay, exit = true }: AnimationWrapperProps) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98, x: "50%" }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={
          !exit
            ? undefined
            : {
                opacity: 0,
                scale: 0.98,
                x: "50%",
                transition: { duration: 0.15, ease: "easeIn" },
              }
        }
        transition={{ type: "spring", stiffness: 450, damping: 40, delay }}
      >
        {children}
      </motion.div>
    );
  },

  Left: ({ children, delay, exit = true }: AnimationWrapperProps) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98, x: "-50%" }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={
          !exit
            ? undefined
            : {
                opacity: 0,
                scale: 0.98,
                x: "-50%",
                transition: { duration: 0.05, ease: "easeIn" },
              }
        }
        transition={{ type: "spring", stiffness: 450, damping: 40, delay }}
      >
        {children}
      </motion.div>
    );
  },
};

export default AnimationWrapper;
