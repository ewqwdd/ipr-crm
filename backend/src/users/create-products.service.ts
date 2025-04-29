import { Injectable } from '@nestjs/common';

/**
 * Пользователь с привязками к продукту, департаменту и направлению
 */
type User = {
  product?: string;
  department?: string;
  direction?: string;
};

/**
 * Команда в системе (team), которая может быть продуктом, департаментом или направлением
 */
type Team = {
  id: number;
  name: string;
  parentTeamId: number | null;
  parentTeam?: {
    name: string;
  };
};

/**
 * Структура продуктов, департаментов, направлений и групп
 * Пример:
 * {
 *   "Product A": {
 *     "Department X": {
 *       "Direction 1": Set("Group 1", "Group 2")
 *     }
 *   }
 * }
 */
export type ProductsStructure = {
  [product: string]: {
    [department: string]: {
      [direction: string]: Set<string>; // группы
    };
  };
};

/**
 * Структура департаментов для создания
 * Ключ — продукт, значение — массив департаментов
 */
type DepartmentsToCreate = {
  [product: string]: string[];
};

/**
 * Структура направлений для создания
 * Ключ — продукт, значение — объект департаментов и их направлений
 */
type DirectionsToCreate = {
  [product: string]: {
    [department: string]: string[];
  };
};

@Injectable()
export class CreateProductsService {
  /**
   * Получает список продуктов, которых нет среди существующих команд на верхнем уровне (parentTeamId === null)
   *
   * @param products Структура продуктов с департаментами и направлениями
   * @param existingTeams Список всех существующих команд
   * @returns Массив имён продуктов, которые нужно создать
   */
  getProductsToCreate(
    products: ProductsStructure,
    existingTeams: Team[],
  ): string[] {
    return Object.keys(products).filter(
      (product) =>
        !existingTeams.find(
          (team) => team.name === product && !team.parentTeamId,
        ),
    );
  }

  /**
   * Получает структуру департаментов для создания.
   * Проверяет, что департамент:
   * - Либо не существует,
   * - Либо существует, но неправильно привязан к продукту.
   *
   * @param products Структура продуктов с департаментами и направлениями
   * @param existingTeams Список всех существующих команд
   * @returns Объект с продуктами и списками департаментов для создания
   */
  getDepartmentsToCreate(
    products: ProductsStructure,
    existingTeams: Team[],
  ): DepartmentsToCreate {
    return Object.keys(products).reduce<DepartmentsToCreate>((acc, product) => {
      const departments = Object.keys(products[product]);
      acc[product] = departments.filter((department) => {
        const foundTeam = existingTeams.find(
          (t) => t.name === department && t.parentTeam?.name === product,
        );
        if (!foundTeam) return true;
        const foundParent = existingTeams.find(
          (t) => t.id === foundTeam.parentTeamId,
        );
        if (
          !foundParent ||
          foundParent.parentTeamId !== null ||
          foundParent.name !== product
        )
          return true;
        return false;
      });
      return acc;
    }, {});
  }

  /**
   * Получает структуру направлений для создания.
   * Проверяет, что направление:
   * - Либо не существует,
   * - Либо привязано к неправильному департаменту,
   * - Либо департамент привязан к неправильному продукту.
   *
   * @param products Структура продуктов с департаментами и направлениями
   * @param existingTeams Список всех существующих команд
   * @returns Объект с продуктами, департаментами и списками направлений для создания
   */
  getDirectionsToCreate(
    products: ProductsStructure,
    existingTeams: Team[],
  ): DirectionsToCreate {
    const teamsMap = new Map<number, Team>();
    existingTeams.forEach((team) => {
      teamsMap.set(team.id, team);
    });

    return Object.keys(products).reduce<DirectionsToCreate>((acc, product) => {
      const departments = Object.keys(products[product]);
      departments.forEach((department) => {
        const directions = Object.keys(products[product][department]);
        acc[product] = acc[product] || {};
        acc[product][department] = directions.filter((direction) => {
          const foundDirection = existingTeams.find((t) => {
            const parent = teamsMap.get(t.parentTeamId);
            return (
              t.name === direction &&
              parent?.name === department &&
              parent?.parentTeam.name === product
            );
          });
          if (!foundDirection) return true;

          const foundDepartment = existingTeams.find(
            (t) =>
              t.id === foundDirection.parentTeamId &&
              t.parentTeam?.name === product,
          );
          if (!foundDepartment || !foundDepartment.parentTeamId) return true;

          const foundProduct = existingTeams.find(
            (t) => t.id === foundDepartment.parentTeamId,
          );
          if (
            !foundProduct ||
            foundProduct.name !== product ||
            foundProduct.parentTeamId !== null
          )
            return true;

          return false;
        });
      });
      return acc;
    }, {});
  }

  getGroupsToCreate(
    products: ProductsStructure,
    existingTeams: Team[],
  ): {
    [product: string]: {
      [department: string]: { [direction: string]: string[] };
    };
  } {
    return Object.keys(products).reduce(
      (acc, product) => {
        const teamsMap = new Map<number, Team>();
        existingTeams.forEach((team) => {
          teamsMap.set(team.id, team);
        });

        const departments = Object.keys(products[product]);
        acc[product] = {};
        departments.forEach((department) => {
          const directions = Object.keys(products[product][department]);
          acc[product][department] = {};
          directions.forEach((direction) => {
            const groups = Array.from(products[product][department][direction]);
            acc[product][department][direction] = groups.filter((group) => {
              const foundGroup = existingTeams.find((t) => {
                const parent = teamsMap.get(t.parentTeamId);
                return (
                  t.name === group &&
                  parent?.name === direction &&
                  parent?.parentTeam.name === department
                );
              });
              if (!foundGroup) return true;

              const foundDirection = existingTeams.find((t) => {
                const parent = teamsMap.get(t.parentTeamId);
                return (
                  t.id === foundGroup.parentTeamId &&
                  parent?.name === department &&
                  parent?.parentTeam.name === product
                );
              });
              if (!foundDirection || foundDirection.name !== direction)
                return true;

              const foundDepartment = existingTeams.find((t) => {
                const parent = teamsMap.get(t.parentTeamId);
                return (
                  t.id === foundDirection.parentTeamId &&
                  parent?.name === product &&
                  parent?.parentTeamId === null
                );
              });
              if (!foundDepartment || foundDepartment.name !== department)
                return true;

              const foundProduct = existingTeams.find(
                (t) => t.id === foundDepartment.parentTeamId,
              );
              if (
                !foundProduct ||
                foundProduct.name !== product ||
                foundProduct.parentTeamId !== null
              )
                return true;

              return false;
            });
          });
        });
        return acc;
      },
      {} as {
        [product: string]: {
          [department: string]: { [direction: string]: string[] };
        };
      },
    );
  }
}
