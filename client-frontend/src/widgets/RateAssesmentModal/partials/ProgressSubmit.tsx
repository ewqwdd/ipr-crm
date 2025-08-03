import { closeModalAtom } from "@/atoms/modalAtom";
import {
  rateProgressAtom,
  rateProgressErrorsAtom,
  type RateProgresItem,
} from "@/atoms/rateProgressAtom";
import { $api } from "@/shared/lib/$api";
import { cva } from "@/shared/lib/cva";
import { rateService } from "@/shared/lib/services/rateService";
import { queryKeys } from "@/shared/types/query-keys";
import type { Rate } from "@/shared/types/Rate";
import Button from "@/shared/ui/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface ProgressSubmitProps {
  rate: Rate;
  queryKey: string;
}

export default function ProgressSubmit({
  rate,
  queryKey,
}: ProgressSubmitProps) {
  const closeModal = useSetAtom(closeModalAtom);
  const progressRates = useAtomValue(rateProgressAtom);
  const setErrors = useSetAtom(rateProgressErrorsAtom);

  const userRates = useAtomValue(rateProgressAtom);
  const prevRates = useRef<RateProgresItem[]>(undefined);
  const cb = useRef<ReturnType<typeof setTimeout>>(null);
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof prevRates.current === "undefined") {
      prevRates.current = userRates;
      return;
    }
    if (userRates.length === 0) return;
    if (cb.current) clearTimeout(cb.current);
    setLoading(true);
    const changedRates = userRates.filter(
      (r) =>
        !prevRates.current?.find(
          (pr) => pr.indicatorId === r.indicatorId && pr.rate === r.rate,
        ),
    );
    if (changedRates.length) {
      cb.current = setTimeout(() => {
        const savedOldRates = prevRates.current?.slice();
        $api
          .post("/rate360/assesment/indicator", {
            rates: changedRates,
            rateId: rate.id,
          })
          .catch(() => {
            toast.error("Ошибка сохранения результатов");
            prevRates.current = savedOldRates;
          })
          .finally(() => {
            setLoading(false);
            queryClient.invalidateQueries({
              queryKey: [queryKey],
            });
            queryClient.invalidateQueries({
              queryKey: [queryKeys.ratesMe],
            });
          });
        prevRates.current = userRates;
      }, 1500);
    }
  }, [userRates, rate.id]);

  const indicators = rateService.getIndicators(rate.competencyBlocks);

  const handleSubmit = () => {
    const errors: number[] = [];
    indicators.forEach((i) => {
      if (!progressRates.find((r) => r.indicatorId === i.id)) {
        errors.push(i.id);
      }
    });
    if (errors.length > 0) {
      toast.error("Ответьте на все вопросы");
      console.debug("errors", errors);
      setErrors(errors);
      return;
    }
    $api
      .post(
        queryKey === queryKeys.assignedRates
          ? `/rate360/assesment/approve-assigned/${rate.id}`
          : `/rate360/assesment/approve-self/${rate.id}`,
      )
      .catch(() => {
        toast.error("Ошибка сохранения результатов");
      })
      .finally(() => {
        closeModal();
      });
  };

  return (
    <Button
      variant="primary"
      className={cva({
        "opacity-50": loading,
      })}
      onClick={handleSubmit}
    >
      {loading ? "Подождите" : "Сохранить оценку"}
    </Button>
  );
}
