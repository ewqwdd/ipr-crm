import { modalTypeAtom } from "@/atoms/modalAtom";
import { useAtomValue } from "jotai";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { memo } from "react";
import SupportModal from "@/widgets/SupportModal";
import RateProgressModal from "@/widgets/RateProgressModal";
import RateAssesmentModal from "@/widgets/RateAssesmentModal";
import RateConfirmModal from "@/widgets/RateConfirmModal";
import TaskModal from "@/widgets/TaskModal";

export default memo(function Modals() {
  const type = useAtomValue(modalTypeAtom);

  return createPortal(
    <AnimatePresence>
      {type === "SUPPORT" && <SupportModal />}
      {type === "RATE_PROGRESS" && <RateProgressModal />}
      {type === "RATE_ASSESSMENT" && <RateAssesmentModal />}
      {type === "RATE_CONFIRM" && <RateConfirmModal />}
      {type === "TASK" && <TaskModal />}
    </AnimatePresence>,
    document.body,
  );
});
