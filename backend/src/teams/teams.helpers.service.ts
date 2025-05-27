import { Injectable } from '@nestjs/common';
import { Prisma, Team } from '@prisma/client';
import { PrismaService } from 'src/utils/db/prisma.service';

@Injectable()
export class TeamsHelpersService {
  constructor(private readonly prisma: PrismaService) {}

  async findRootTeam(
    teamId: number,
  ): Promise<{ id: number; name: string } | null> {
    const result = await this.prisma.$queryRaw`
    WITH RECURSIVE team_hierarchy AS (
      SELECT id, "parentTeamId", name
      FROM "Team"
      WHERE id = ${teamId}

      UNION ALL

      SELECT t.id, t."parentTeamId", t.name
      FROM "Team" t
      JOIN team_hierarchy th ON t.id = th."parentTeamId"
    )
    SELECT id, name FROM team_hierarchy WHERE "parentTeamId" IS NULL LIMIT 1;
  `;

    return (result as { id: number; name: string }[] | undefined)?.length
      ? result[0]
      : null;
  }

  async findRootTeamsForMultiple(
    teamIds: number[],
  ): Promise<Map<number, { id: number; name: string }>> {
    if (!teamIds.length) return new Map();

    // 1. Получаем все команды в иерархии для указанных ID
    const result = await this.prisma.$queryRaw`
    WITH RECURSIVE team_hierarchy AS (
      SELECT id, "parentTeamId", name, id as original_id
      FROM "Team"
      WHERE id IN (${Prisma.join(teamIds)})

      UNION ALL

      SELECT t.id, t."parentTeamId", t.name, th.original_id
      FROM "Team" t
      JOIN team_hierarchy th ON t.id = th."parentTeamId"
    )
    SELECT id, name, original_id 
    FROM team_hierarchy 
    WHERE "parentTeamId" IS NULL;
  `;

    // 2. Создаем Map: ID исходной команды -> корневая команда
    const rootTeamsMap = new Map<number, { id: number; name: string }>();

    for (const row of result as {
      id: number;
      name: string;
      original_id: number;
    }[]) {
      rootTeamsMap.set(row.original_id, { id: row.id, name: row.name });
    }

    return rootTeamsMap;
  }
}
