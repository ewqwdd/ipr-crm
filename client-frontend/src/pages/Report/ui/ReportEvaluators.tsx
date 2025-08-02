import type { Rate } from "@/shared/types/Rate";

interface ReportEvaluatorsProps {
  evaluators: Rate["evaluators"];
}

export default function ReportEvaluators({
  evaluators,
}: ReportEvaluatorsProps) {
  const curators = evaluators.filter((ev) => ev.type === "CURATOR");
  const subordinates = evaluators.filter((ev) => ev.type === "SUBORDINATE");
  const teamMembers = evaluators.filter((ev) => ev.type === "TEAM_MEMBER");

  return (
    <div className="border border-foreground-1 rounded-lg overflow-clip">
      <table className="min-w-full rounded-lg">
        <thead>
          <tr>
            <th className="w-1/6 px-4 pt-2  border-r border-foreground-1 text-left font-medium">
              Окружение
            </th>
            <th className="px-4 pt-2  text-left font-medium "></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="align-top px-4 py-2 border-r border-foreground-1"></td>
            <td className="px-4 pb-2">
              <div>
                <span className="font-semibold">Руководители</span>
                <ul>
                  {curators.map((curator) => (
                    <li key={curator.userId} className="text-sm text-secondary">
                      {curator.user.username}
                    </li>
                  ))}
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td className="align-top px-4 py-2 border-r border-foreground-1 "></td>
            <td className="px-4 py-2 border-t border-foreground-1">
              <span className="font-semibold">Коллеги</span>
              <ul>
                {teamMembers.map((teamMember) => (
                  <li
                    key={teamMember.userId}
                    className="text-sm text-secondary"
                  >
                    {teamMember.user.username}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
          <tr>
            <td className="align-top px-4 py-2 border-r border-foreground-1 "></td>
            <td className="px-4 py-2 border-t border-foreground-1">
              <span className="font-semibold">Подчиненные</span>
              <ul>
                {subordinates.map((subordinate) => (
                  <li
                    key={subordinate.userId}
                    className="text-sm text-secondary"
                  >
                    {subordinate.user.username}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
