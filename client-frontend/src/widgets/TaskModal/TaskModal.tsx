import {
  closeModalAtom,
  modalDataAtom,
  type ModalData,
} from "@/atoms/modalAtom";
import ConditionalModalDrawer from "@/features/ConditionalModalDrawer";
import { statusNames, taskStatuses, type TaskStatus } from "@/shared/types/Ipr";
import Select from "@/shared/ui/Select";
import { useAtomValue, useSetAtom } from "jotai";
import { useRef, useState } from "react";

const options = taskStatuses.map((status) => ({
  value: status,
  label: statusNames[status],
}));

export default function TaskModal() {
  const closeModal = useSetAtom(closeModalAtom);
  const data = useAtomValue(modalDataAtom) as ModalData["TASK"];
  const ref = useRef<ModalData["TASK"]>(data);
  const task = data?.task ?? ref.current?.task;
  const [status, setStatus] = useState<string>(task.status);

  const handleChange = (status: string) => {
    setStatus(status);
    data.onChangeStatus(status as TaskStatus);
  };

  return (
    <ConditionalModalDrawer
      className="gap-3 [&_h2]:overflow-visible min-h-[198px]"
      title={
        <div className="flex gap-2">
          <span>Задача</span>
          <Select
            value={status}
            onChange={handleChange}
            buttonClassName="h-6 px-2 py-0 w-auto min-w-32"
            options={options}
          />
        </div>
      }
      open
      onClose={closeModal}
    >
      <p>{task.material?.name}</p>
    </ConditionalModalDrawer>
  );
}
