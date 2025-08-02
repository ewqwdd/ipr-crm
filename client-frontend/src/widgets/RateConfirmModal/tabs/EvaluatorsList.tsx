import type { Rate } from "@/shared/types/Rate";
import Add from "@/shared/icons/Add.svg";
import SoftButton from "@/shared/ui/SoftButton";
import { motion } from "framer-motion";

interface EvaluatorsListProps {
  evaluators: Rate["evaluators"];
  onRemove: (id: number) => void;
  onAdd: () => void;
  title: string;
}

export default function EvaluatorsList({
  evaluators,
  onRemove,
  onAdd,
  title,
}: EvaluatorsListProps) {
  const mapped = [
    ...evaluators,
    { userId: -1, type: "TEAM_MEMBER", user: { username: "Добавить" } },
  ];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-secondary text-sm">{title}</span>
      <ul className="flex items-center gap-1 flex-wrap">
        {mapped.map((evaluator) =>
          evaluator.userId === -1 ? (
            <motion.li key={evaluator.userId} layout>
              <SoftButton onClick={onAdd}>
                <Add className="size-4" />
                Добавить
              </SoftButton>
            </motion.li>
          ) : (
            <motion.li
              layout
              key={evaluator.userId}
              className="bg-white border border-foreground-1 rounded-3xl h-8 flex items-center gap-2 text-primary pl-3 pr-2 text-sm"
            >
              {evaluator.user.username}
              <button
                onClick={() => onRemove(evaluator.userId)}
                className="cursor-pointer"
              >
                <Add className="size-4 rotate-45" />
              </button>
            </motion.li>
          ),
        )}
      </ul>
    </div>
  );
}
