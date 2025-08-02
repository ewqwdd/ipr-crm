import { twMerge } from "tailwind-merge";

type CVAelem = string | Record<string, boolean> | undefined;
/**
 * аналог либы clsx, можно передавать обьект где ключ - это класс, а значение - булево или строку
 */
export const cva = (...args: CVAelem[]) => {
  const val = args.map((elem) => {
    if (typeof elem === "string") {
      return elem;
    } else if (elem) {
      return Object.entries(elem)
        .filter(([, value]) => value)
        .map((elem) => elem[0])
        .join(" ");
    }
  });
  return twMerge(...val);
};
