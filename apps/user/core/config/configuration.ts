import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';

export enum Environment {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  TESTING = 'TESTING',
}

export class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  BASIC_AUTH_USERNAME: string;

  @IsString()
  BASIC_AUTH_PASSWORD: string;

  @IsString()
  EMAIL_PASSWORD: string;

  @IsString()
  EMAIL_USER: string;

  @IsString()
  EMAIL_SERVICE: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  DATABASE_URL_FOR_TESTS: string;

  @IsString()
  OAUTH_GITHUB_CLIENT_ID: string;
  @IsString()
  OAUTH_GITHUB_CLIENT_SECRET: string;
  @IsString()
  OAUTH_GITHUB_REDIRECT_URL: string;

  @IsString()
  OAUTH_GOOGLE_CLIENT_ID: string;
  @IsString()
  OAUTH_GOOGLE_CLIENT_SECRET: string;
  @IsString()
  OAUTH_GOOGLE_REDIRECT_URL: string;

  // @IsOptional()
  // @IsString()
  // DATABASE_REMOTE_URL?: string;

  // @IsOptional()
  // @IsString()
  // DATABASE_NAME?: string;

  // @IsOptional()
  // @IsNumber()
  // POSTGRES_PORT?: number;

  // @IsOptional()
  // @IsString()
  // POSTGRES_USER?: string;

  // @IsOptional()
  // @IsString()
  // POSTGRES_PASSWORD?: string;

  // @IsOptional()
  // @IsString()
  // MAIN_DB?: 'postgres' | 'mongodb' | 'mysql';

  // @IsString()
  // AWS_REGION: string;

  // @IsString()
  // AWS_ACCESS_KEY_ID: string;

  // @IsString()
  // AWS_SECRET_ACCESS_KEY: string;

  // @IsString()
  // AWS_ENDPOINT: string;

  // @IsString()
  // AWS_BUCKET_NAME: string;

  // @IsString()
  // REDIS_HOST: string;

  // @IsNumber()
  // REDIS_PORT: number;

  // @IsOptional()
  // @IsString()
  // REDIS_PASSWORD?: string;

  // @IsString()
  // TELEGRAM_TOKEN: string;

  // @IsOptional()
  // @IsString()
  // TG_BOT_FOR_TESTS_TOKEN?: string;

  // @IsString()
  // STRIPE_SUCCESS_URL: string;

  // @IsString()
  // STRIPE_CANCEL_URL: string;

  // @IsString()
  // STRIPE_API_KEY: string;

  // @IsString()
  // STRIPE_SECRET: string;

  // @IsString()
  // STRIPE_WEBHOOK_SECRET: string;

  @IsString()
  GOOGLE_CAPTURE_SECRET: string;

  @IsString()
  CAPTURE_SITE_KEY: string;

  @IsEnum(Environment)
  ENV: Environment;
}
export type EnvironmentVariable = { [key: string]: string | undefined };
export type EnvironmentTypes = keyof typeof Environment;

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
