/**
 * Находит первый подходящий набор элементов в иерархии folder -> team -> spec
 * @param folders Массив папок продуктов
 * @param productName Имя продукта для поиска
 * @param teamName Имя команды для поиска
 * @param specName Имя спецификации для поиска
 * @returns Объект с найденными элементами или null, если не найдено
 */
export function findHierarchyElements<
  F extends { name: string; teams: T[] },
  T extends { name: string; specs: S[] },
  S extends { name: string; competencyBlocks?: any[] },
>(
  folders: F[],
  productName: string,
  teamName: string,
  specName: string,
): { folder: F; team: T; spec: S } | null {
  for (const folder of folders) {
    if (folder.name !== productName) continue;

    const team = folder.teams.find((t) => t.name === teamName);
    if (!team) continue;

    const spec = team.specs.find((s) => s.name === specName);
    if (!spec) continue;

    return { folder, team, spec };
  }

  return null;
}
