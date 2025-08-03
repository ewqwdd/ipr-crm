import {
  closeModalAtom,
  modalDataAtom,
  type ModalData,
} from "@/atoms/modalAtom";
import ConditionalModalDrawer from "@/features/ConditionalModalDrawer";
import { statusNames, taskStatuses, type TaskStatus } from "@/shared/types/Ipr";
import Badge from "@/shared/ui/Badge";
import Select from "@/shared/ui/Select";
import { useAtomValue, useSetAtom } from "jotai";
import { useRef, useState } from "react";
import Dead from "@/shared/icons/Dead.svg";
import { dateService } from "@/shared/lib/services/dateService";
import PriorityBadge from "@/features/PriorityBadge";
import MaterialContentTypeBadge from "@/features/MaterialContentTypeBadge";

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
      <div className="flex gap-1">
        {task.deadline && (
          <Badge
            variant="secondary"
            className="gap-1"
            icon={<Dead className="size-4" />}
          >
            {dateService.formatDate(task.deadline)}
          </Badge>
        )}
        {task.priority && <PriorityBadge priority={task.priority} />}
        {task.material?.contentType && (
          <MaterialContentTypeBadge type={task.material?.contentType} />
        )}
      </div>
    </ConditionalModalDrawer>
  );
}
