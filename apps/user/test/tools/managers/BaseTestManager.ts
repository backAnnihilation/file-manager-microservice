import { HttpServer, INestApplication } from '@nestjs/common';
import { SortDirection } from '../../../core/utils/sorting-base-filter';
import { AuthConstantsType, constants } from '../utils/test-constants';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export class BaseTestManager {
  protected readonly constants: AuthConstantsType;
  protected readonly application: INestApplication<HttpServer>;
  protected usersRepo: Prisma.UserAccountDelegate<DefaultArgs>;
  protected readonly prisma: PrismaClient;

  constructor(protected readonly app: INestApplication) {
    this.constants = constants.auth;
    this.prisma = this.app.get(PrismaClient);
    this.usersRepo = this.prisma.userAccount;
    this.application = this.app.getHttpServer();
  }
  assertMatch(responseData: any, expectedResult: any) {
    expect(responseData).toEqual(expectedResult);
  }
  isSortedByField = <T>(sortData: SortedByFieldType<T>) => {
    let { field, entities, sortDirection } = sortData;
    let isSorted = true;

    field = field === 'title' ? ('name' as any) : field;

    for (let i = 0; i < entities.length - 1; i++) {
      const currentValue = entities[i][field];
      const nextValue = entities[i + 1][field];

      if (typeof currentValue === 'string' && typeof nextValue === 'string') {
        if (sortDirection.toUpperCase() === SortDirection.ASC) {
          if (currentValue.localeCompare(nextValue) > 0) {
            isSorted = false;
            break;
          }
        } else {
          if (currentValue.localeCompare(nextValue) < 0) {
            isSorted = false;
            break;
          }
        }
      } else if (
        typeof currentValue === 'number' &&
        typeof nextValue === 'number'
      ) {
        if (sortDirection.toUpperCase() === SortDirection.ASC) {
          if (currentValue > nextValue) {
            isSorted = false;
            break;
          }
        } else {
          if (currentValue < nextValue) {
            isSorted = false;
            break;
          }
        }
      } else if (currentValue instanceof Date && nextValue instanceof Date) {
        if (sortDirection.toUpperCase() === SortDirection.ASC) {
          if (currentValue.getTime() > nextValue.getTime()) {
            isSorted = false;
            break;
          }
        } else {
          if (currentValue.getTime() < nextValue.getTime()) {
            isSorted = false;
            break;
          }
        }
      } else {
        throw new Error(
          `Unsupported field type for sorting: ${typeof currentValue}`,
        );
      }
    }

    expect(isSorted).toBe(true);
  };
}

type SortedByFieldType<T> = {
  entities: T[];
  field: keyof T;
  sortDirection: SortDirection;
};
