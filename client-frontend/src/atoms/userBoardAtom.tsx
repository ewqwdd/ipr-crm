import type { BoardColumns } from "@/shared/types/board";
import { atom } from "jotai";

export const userBoardAtom = atom<BoardColumns | null>();
