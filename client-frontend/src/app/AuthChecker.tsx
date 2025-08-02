import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { checkAuthAtom, userAtom, userLoadingAtom } from "@/atoms/userAtom";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export function AuthChecker({ children }: Props) {
  const [user] = useAtom(userAtom);
  const [isLoading] = useAtom(userLoadingAtom);
  const [delayed, setDealyed] = useState(true);
  const [, checkAuth] = useAtom(checkAuthAtom);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/login");
      }
      const timeout = setTimeout(() => {
        setDealyed(false);
      }, 650);
      return () => clearTimeout(timeout);
    }
  }, [user, isLoading]);

  if (isLoading || delayed) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        animate={{
          opacity: !isLoading && delayed ? 0 : 1,
          transition: { duration: 0.7 },
        }}
        initial={{ opacity: 1 }}
      >
        <h1 className="font-extrabold text-3xl animate-pulse">Skills.</h1>
      </motion.div>
    );
  }

  return children;
}
