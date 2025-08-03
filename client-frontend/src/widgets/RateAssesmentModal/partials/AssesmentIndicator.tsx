import type { Indicator, SkillType } from "@/shared/types/Rate";
import SoftButton from "@/shared/ui/SoftButton";
import Tooltip from "@/shared/ui/Tooltip";
import { motion } from "framer-motion";
import Check from "@/shared/icons/Check.svg";
import {
  hintsDescriptionHard,
  hintsDescriptionSoft,
  hintsTitleHard,
  hintsTitleSoft,
} from "@/shared/constants/hints";
import { memo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  rateProgressErrorsAtom,
  setRateProgress,
} from "@/atoms/rateProgressAtom";

interface AssesmentIndicatorProps {
  indicator: Indicator;
  activeId?: number;
  skillType: SkillType;
}
export default memo(function AssesmentIndicator({
  indicator,
  activeId,
  skillType,
}: AssesmentIndicatorProps) {
  const setRateAtom = useSetAtom(setRateProgress);
  const errors = useAtomValue(rateProgressErrorsAtom);
  const setErrors = useSetAtom(rateProgressErrorsAtom);

  const rateDescriptions =
    skillType === "HARD" ? hintsDescriptionHard : hintsDescriptionSoft;
  const hintsTitle = skillType === "HARD" ? hintsTitleHard : hintsTitleSoft;

  const descriptions = {
    1: indicator.hint1 ?? rateDescriptions[1],
    2: indicator.hint2 ?? rateDescriptions[2],
    3: indicator.hint3 ?? rateDescriptions[3],
    4: indicator.hint4 ?? rateDescriptions[4],
    ...(skillType === "SOFT"
      ? // @ts-expect-error
        { 5: indicator.hint5 ?? rateDescriptions[5] }
      : {}),
  };

  const titles = {
    1: indicator.value1 ?? hintsTitle[1],
    2: indicator.value2 ?? hintsTitle[2],
    3: indicator.value3 ?? hintsTitle[3],
    4: indicator.value4 ?? hintsTitle[4],
    // @ts-expect-error
    ...(skillType === "SOFT" ? { 5: indicator.value5 ?? hintsTitle[5] } : {}),
  };

  const activeSkip = activeId === 0;

  return (
    <div className="flex flex-col gap-2 items-start">
      <h3 className="mb-1">{indicator.name}</h3>
      <Tooltip
        content={indicator.skipHint ?? rateDescriptions[0]}
        align="left"
        className="h-8"
      >
        <SoftButton
          onClick={() => {
            setErrors((prev) => prev.filter((id) => id !== indicator.id));
            setRateAtom({ indicatorId: indicator.id, rate: 0 });
          }}
          variant={activeSkip ? "primary" : "teritary"}
          className="[&>div]:pl-2 [&>div]:gap-0"
        >
          <motion.div
            transition={{ duration: 0.25 }}
            initial={{ opacity: 0, width: 0, height: 0 }}
            animate={{
              opacity: activeSkip ? 1 : 0,
              width: activeSkip ? 16 : 0,
              height: activeSkip ? 16 : 0,
              marginRight: activeSkip ? 6 : 3,
            }}
            exit={{ opacity: 0, width: 0, height: 0 }}
          >
            <Check className="size-full" />
          </motion.div>
          {indicator.skipValue ?? hintsTitle[0]}
        </SoftButton>
      </Tooltip>
      {Object.entries(descriptions).map(([value, description]) => {
        const active = activeId === +value;
        return (
          <Tooltip
            content={description}
            key={value}
            align="left"
            className="h-8"
          >
            <SoftButton
              onClick={() => {
                setErrors((prev) => prev.filter((id) => id !== indicator.id));
                setRateAtom({ indicatorId: indicator.id, rate: +value });
              }}
              variant={active ? "primary" : "teritary"}
              className="[&>div]:pl-2 [&>div]:gap-0"
            >
              <motion.div
                transition={{ duration: 0.25 }}
                initial={{ opacity: 0, width: 0, height: 0 }}
                animate={{
                  opacity: active ? 1 : 0,
                  width: active ? 16 : 0,
                  height: active ? 16 : 0,
                  marginRight: active ? 6 : 3,
                }}
                exit={{ opacity: 0, width: 0, height: 0 }}
              >
                <Check className="size-full" />
              </motion.div>
              {/* @ts-expect-error */}
              {titles[value as unknown as keyof typeof hintsTitle]}
            </SoftButton>
          </Tooltip>
        );
      })}
      {errors.includes(indicator.id) && (
        <p className="text-error text-sm">Поле обязательно</p>
      )}
    </div>
  );
});
