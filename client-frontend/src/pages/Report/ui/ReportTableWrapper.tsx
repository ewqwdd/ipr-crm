import type { PropsWithChildren } from "react";

interface ReportTableWrapperProps {
  headers: string[];
}

export default function ReportTableWrapper({
  headers,
  children,
}: PropsWithChildren<ReportTableWrapperProps>) {
  return (
    <div className="overflow-hidden shadow-sm ring-1 ring-foreground-1 md:rounded-lg mt-4">
      <table className="min-w-full divide-y divide-[#d1d5dc]">
        <thead className="bg-[#fbf9fa]">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-3 py-3.5 first:text-left text-sm text-center"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
