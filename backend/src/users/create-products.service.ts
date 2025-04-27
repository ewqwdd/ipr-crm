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
 * Структура продуктов с департаментами и направлениями
 * Пример:
 * {
 *   "Product A": {
 *     "Department X": Set("Direction 1", "Direction 2")
 *   }
 * }
 */
type ProductsStructure = {
  [product: string]: {
    [department: string]: Set<string>;
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
      console.log('departments', departments);
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
        console.log('false');
        return false;
      });
      console.log('acc', acc);
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
    return Object.keys(products).reduce<DirectionsToCreate>((acc, product) => {
      const departments = Object.keys(products[product]);
      departments.forEach((department) => {
        const directions = Array.from(products[product][department]);
        acc[product] = acc[product] || {};
        acc[product][department] = directions.filter((direction) => {
          // TODO filter by existing teams
          const foundDirection = existingTeams.find(
            (t) => t.name === direction && t.parentTeam?.name === department,
          );
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
}
