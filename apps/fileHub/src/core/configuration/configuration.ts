import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { Environment } from '../../../../../libs/shared/environment.enum';

export class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsOptional()
  @IsString()
  DATABASE_LOCAL_URL: string;

  @IsEnum(Environment)
  ENV: Environment;
}
export type EnvironmentVariable = { [key: string]: string | undefined };

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
