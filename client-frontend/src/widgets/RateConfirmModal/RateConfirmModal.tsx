import {
  closeModalAtom,
  modalDataAtom,
  type ModalData,
} from "@/atoms/modalAtom";
import { generalService } from "@/shared/lib/services/generalService";
import type { Rate } from "@/shared/types/Rate";
import Avatar from "@/shared/ui/Avatar";
import { useAtomValue, useSetAtom } from "jotai";
import { useRef, useState } from "react";
import ConfirmMainTab from "./tabs/ConfirmMainTab";
import type { ConfirmTab } from "./config";
import AddEvaluators from "./tabs/AddEvaluators";
import {
  useConfirmRateByCuratorMutation,
  useConfirmRateByUserMutation,
} from "@/shared/hooks/rates";
import { queryKeys } from "@/shared/types/query-keys";
import toast from "react-hot-toast";
import ConditionalModalDrawer from "@/features/ConditionalModalDrawer";
import { AnimatePresence } from "framer-motion";

export default function RateConfirmModal() {
  const closeModal = useSetAtom(closeModalAtom);

  const { mutateAsync: confirmByCurator, isPending: curatorPending } =
    useConfirmRateByCuratorMutation();
  const { mutateAsync: confirmByUser, isPending: userPending } =
    useConfirmRateByUserMutation();

  const data = useAtomValue(modalDataAtom) as ModalData["RATE_CONFIRM"];
  const ref = useRef<ModalData["RATE_CONFIRM"]>(data);
  const rate = data?.rate ?? ref.current?.rate;
  const key = data?.key ?? ref.current?.key;

  const [evaluators, setEvaluators] = useState<Rate["evaluators"]>(
    rate.evaluators,
  );
  const [tab, setTab] = useState<ConfirmTab>("main");

  const mainTitle = (
    <div className="flex items-center gap-2">
      <Avatar
        className="size-6"
        src={generalService.transformFileUrl(rate.user.avatar)}
      />
      <span className="font-extrabold">{rate.user.username}</span>
    </div>
  );

  const editTitle = "Добавить оценивающих";

  const handleEdit = (evaluators: Rate["evaluators"]) => {
    if (tab === "subbordinates") {
      setEvaluators((prev) => [
        ...prev.filter((e) => e.type !== "SUBORDINATE"),
        ...evaluators,
      ]);
    } else if (tab === "team") {
      setEvaluators((prev) => [
        ...prev.filter((e) => e.type !== "TEAM_MEMBER"),
        ...evaluators,
      ]);
    }
    setTab("main");
  };

  const handleSubmit = async (comment?: string) => {
    const data = {
      rateId: rate.id,
      evaluateTeam: evaluators
        .filter((e) => e.type === "TEAM_MEMBER")
        .map((e) => ({
          userId: e.userId,
          username: e.user.username,
        })),
      evaluateCurators: evaluators
        .filter((e) => e.type === "CURATOR")
        .map((e) => ({
          userId: e.userId,
          username: e.user.username,
        })),
      evaluateSubbordinate: evaluators
        .filter((e) => e.type === "SUBORDINATE")
        .map((e) => ({
          userId: e.userId,
          username: e.user.username,
        })),
      comment,
    };
    try {
      if (key === queryKeys.confirmRates) {
        await confirmByUser(data);
      } else {
        await confirmByCurator(data);
      }
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error("Ошибка подтверждения");
    }
  };

  return (
    <ConditionalModalDrawer
      title={tab === "main" ? mainTitle : editTitle}
      loading={curatorPending || userPending}
      open
      onClose={closeModal}
    >
      <AnimatePresence mode="wait">
        {tab === "main" && (
          <ConfirmMainTab
            key="main"
            onSubmit={handleSubmit}
            onAdd={setTab}
            evaluators={evaluators}
            setEvaluators={setEvaluators}
            onCancel={closeModal}
            rate={rate}
          />
        )}
        {tab !== "main" && (
          <AddEvaluators
            key={"add"}
            type={tab === "subbordinates" ? "SUBORDINATE" : "TEAM_MEMBER"}
            onCancel={() => setTab("main")}
            onSubmit={handleEdit}
            rateTeamId={rate.teamId}
            initialEvaluators={evaluators}
          />
        )}
      </AnimatePresence>
    </ConditionalModalDrawer>
  );
}
