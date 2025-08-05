import {
  closeModalAtom,
  modalDataAtom,
  type ModalData,
} from "@/atoms/modalAtom";
import Tabs from "@/shared/ui/Tabs";
import { useAtomValue, useSetAtom } from "jotai";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import AssesmentBlock from "./partials/AssesmentBlock";
import {
  rateProgressErrorsAtom,
  setRatesProgress,
} from "@/atoms/rateProgressAtom";
import { setCommentsProgress } from "@/atoms/commentsProgressAtom";
import Button from "@/shared/ui/Button";
import ProgressSubmit from "./partials/ProgressSubmit";
import ConditionalModalDrawer from "@/features/ConditionalModalDrawer";
import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import TabButtonsWithNotifications from "@/features/TabButtonsWithNotifications";
import type { TabButtonsWithNotificationsConfig } from "@/features/TabButtonsWithNotifications/types";
import Divider from "@/shared/ui/Divider";

export default function RateAssesmentModal() {
  const closeModal = useSetAtom(closeModalAtom);
  const data = useAtomValue(modalDataAtom) as ModalData["RATE_ASSESSMENT"];
  const ref = useRef<ModalData["RATE_ASSESSMENT"]>(data);
  const setRates = useSetAtom(setRatesProgress);
  const setErrors = useSetAtom(rateProgressErrorsAtom);
  const setComments = useSetAtom(setCommentsProgress);
  const [inited, setInited] = useState(false);

  const isMobile = useIsMobile();

  const rate = data?.rate ?? ref.current?.rate;
  const initialTab = data?.initialTab ?? ref.current?.initialTab;
  const key = data?.key ?? ref.current?.key;
  const [tab, setTab] = useState(
    initialTab ?? rate.competencyBlocks[0]?.id.toString(),
  );

  const currentBlock = rate.competencyBlocks.find(
    (b) => b.id.toString() === tab,
  );

  useLayoutEffect(() => {
    setRates(rate.userRates);
    setComments(rate.comments);
    setInited(true);

    return () => {
      setRates([]);
      setComments([]);
      setErrors([]);
    };
  }, [rate]);

  const config = useMemo<
    Record<string, TabButtonsWithNotificationsConfig>
  >(() => {
    return rate.competencyBlocks.reduce(
      (acc, b) => {
        acc[b.id] = {
          label: b.name,
        };
        return acc;
      },
      {} as Record<string, TabButtonsWithNotificationsConfig>,
    );
  }, [rate.competencyBlocks]);

  return (
    <ConditionalModalDrawer
      className="lg:max-w-[656px] max-lg:rounded-t-none max-lg:gap-0"
      title={<span className="sm:text-3xl text-lg">{rate.spec.name}</span>}
      open
      onClose={closeModal}
      closeOnOutside={false}
    >
      {isMobile ? (
        <>
          <TabButtonsWithNotifications
            className="mt-3"
            currentTab={tab}
            onTabChange={setTab}
            config={config}
            tabs={rate.competencyBlocks.map((b) => b.id.toString())}
          />
          <Divider className="-mx-5 w-auto" />
        </>
      ) : (
        <Tabs
          tabs={rate.competencyBlocks.map((b) => ({
            label: b.name,
            value: b.id.toString(),
          }))}
          value={tab}
          onChange={setTab}
        />
      )}
      {currentBlock && (
        <AssesmentBlock
          rateId={rate.id}
          block={currentBlock}
          skillType={rate.type}
        />
      )}
      <div className="mt-1 flex gap-4 max-lg:mt-5">
        <Button
          className="max-sm:hidden"
          variant="teritary"
          onClick={closeModal}
        >
          Отменить
        </Button>
        <p className="text-sm text-secondary font-extrabold max-w-64 ml-auto">
          <span className="text-error">* </span>
          <span>Сохраняя, вы больше не сможете изменить оценку</span>
        </p>
        {inited && <ProgressSubmit queryKey={key} rate={rate} />}
      </div>
    </ConditionalModalDrawer>
  );
}
