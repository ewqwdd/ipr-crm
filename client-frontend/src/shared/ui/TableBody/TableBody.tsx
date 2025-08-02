import { cva } from "@/shared/lib/cva";
import { type ReactNode } from "react";

type Render<T> = (data: T, index: number) => ReactNode;

interface TableBodyProps<T> {
  data: T[];
  columnRender: (
    | Render<T>
    | {
        render: Render<T>;
        className?: string;
      }
  )[];
  className?: string;
}
export default function TableBody<T>({
  data,
  columnRender,
  className,
}: TableBodyProps<T>) {
  return (
    <tbody className={className}>
      {data.map((row, index) => (
        <tr key={index}>
          {columnRender.map((column, i) => (
            <td
              key={i}
              className={cva(
                "text-sm text-primary/80 font-semibold px-3 py-4 whitespace-nowrap",
                typeof column !== "object" ? "" : column.className,
              )}
            >
              {typeof column === "function"
                ? column(row, index)
                : column.render(row, index)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
