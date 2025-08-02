import {
  closeModalAtom,
  modalDataAtom,
  openModalAtom,
  type ModalData,
} from "@/atoms/modalAtom";
import Divider from "@/shared/ui/Divider";
import { useAtomValue, useSetAtom } from "jotai";
import { useRef, useState } from "react";
import RateProgressItem from "./RateProgressItem";
import { userAtom } from "@/atoms/userAtom";
import Button from "@/shared/ui/Button";
import { $api } from "@/shared/lib/$api";
import { queryKeys } from "@/shared/types/query-keys";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import StatItem from "@/shared/ui/StatItem";
import { rateService } from "@/shared/lib/services/rateService";
import ConditionalModalDrawer from "@/features/ConditionalModalDrawer";

export default function RateProgressModal() {
  const closeModal = useSetAtom(closeModalAtom);
  const data = useAtomValue(modalDataAtom) as ModalData["RATE_PROGRESS"];
  const ref = useRef<ModalData["RATE_PROGRESS"]>(data);
  const openModal = useSetAtom(openModalAtom);
  const user = useAtomValue(userAtom);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const rate = data?.rate ?? ref.current?.rate;
  const queryKey = data?.key ?? ref.current?.key;

  const allIndicators = rateService.getIndicators(rate.competencyBlocks).length;
  const allUserRates = rate.userRates.filter(
    (r) => r.userId === user!.id,
  ).length;

  const handleFinish = async () => {
    if (allIndicators > allUserRates) return;
    try {
      setLoading(true);
      await $api.post(
        queryKey === queryKeys.assignedRates
          ? `/rate360/assesment/approve-assigned/${rate.id}`
          : `/rate360/assesment/approve-self/${rate.id}`,
      );
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.ratesMe],
      });
      closeModal();
    } catch {
      toast.error("Ошибка сохранения результатов");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConditionalModalDrawer title="Оценка 360" open onClose={closeModal}>
      <div className="flex flex-col font-extrabold">
        <div className="grid grid-cols-2 gap-3">
          <StatItem label="Оцениваемый" value={rate.user.username} />
          <StatItem
            label="Навыки"
            value={rate.type.toLocaleLowerCase()}
            className="[&_p]:capitalize"
          />
          <StatItem label="Команда" value={rate.team?.name ?? "-"} />
          <StatItem label="Специализация" value={rate.spec.name} />
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          {rate.competencyBlocks.map((block) => (
            <RateProgressItem
              openAssesment={() =>
                openModal({
                  type: "RATE_ASSESSMENT",
                  data: {
                    key: queryKey,
                    rate,
                    initialTab: block.id.toString(),
                  },
                })
              }
              block={block}
              key={block.id}
              userRates={rate.userRates}
            />
          ))}
        </div>
        <Divider />
        <p className="text-sm text-secondary leading-normal">
          Опрос завершится после того как вы дадите ответы на все вопросы в
          анкете. По мере прохождения опроса в каждом блоке будут отражены ваши
          оценки. Данные вами ответы будут преобразованы в баллы и представлены
          без привязки к конкретному человеку.
        </p>
        {allIndicators <= allUserRates && (
          <Button onClick={handleFinish} disabled={loading} className="mt-3">
            {loading ? "Завершение..." : "Завершить оценку"}
          </Button>
        )}
      </div>
    </ConditionalModalDrawer>
  );
}
