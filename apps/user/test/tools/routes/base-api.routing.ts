import { Environment } from '@app/shared';

export const BASE_PREFIX = '/api/v1';

export abstract class BaseRouting {
  protected readonly baseUrl: string;
  protected readonly _basePrefix = BASE_PREFIX;

  constructor(baseUrl: string) {
    const env = process.env.ENV;
    let basePrefix = this._basePrefix;
    env === Environment.TESTING && (basePrefix = '');
    this.baseUrl = `${basePrefix}${baseUrl}`;
  }
}
