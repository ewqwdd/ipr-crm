import type { Task, TaskStatus } from "@/shared/types/Ipr";
import type { Rate } from "@/shared/types/Rate";
import type { Getter } from "jotai";
import type { Setter } from "jotai";
import { atom } from "jotai";

export type ModalType =
  | "SUPPORT"
  | "RATE_PROGRESS"
  | "RATE_ASSESSMENT"
  | "RATE_CONFIRM"
  | "TASK"
  | null;

export type ModalData = {
  RATE_PROGRESS: {
    rate: Rate;
    key: string;
  };
  RATE_ASSESSMENT: {
    rate: Rate;
    initialTab?: string;
    key: string;
  };
  RATE_CONFIRM: {
    rate: Rate;
    key: string;
  };
  TASK: {
    task: Task;
    onChangeStatus: (status: TaskStatus) => void;
  };
};

export type ModalState = {
  type: ModalType;
  data?: ModalData[keyof ModalData];
};

export const modalAtom = atom<ModalState>({
  type: null,
  data: undefined,
});

export const isOpenModalAtom = atom((get) => get(modalAtom).type !== null);

export const modalTypeAtom = atom((get) => get(modalAtom).type);

export const modalDataAtom = atom((get) => get(modalAtom).data);

export const openModalAtom = atom(
  null,
  <T extends Exclude<ModalState["type"], null>>(
    _: Getter,
    set: Setter,
    {
      type,
      data,
    }: { type: T; data?: T extends keyof ModalData ? ModalData[T] : never },
  ) => {
    set(modalAtom, { type, data });
  },
);

export const closeModalAtom = atom(null, (_, set) => {
  set(modalAtom, {
    type: null,
    data: undefined,
  });
});
