import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../configuration/configuration';
import { Environment } from '@shared/environment.enum';
import { COLORS } from '@shared/logger';

export const getConnection = async (
  configService: ConfigService<EnvironmentVariables>,
) => {
  const ENV = configService.get('ENV');
  const isTesting = ENV === Environment.TESTING;
  const URL = isTesting
    ? configService.get('DATABASE_LOCAL_URL')
    : configService.get('DATABASE_URL');

  // setTimeout(() => {
  //   console.log(
  //     `${COLORS.warning}Connecting to MongoDB ${
  //       isTesting ? 'locally' : 'remote'
  //     }`,
  //   );
  // }, 50);
  console.log(
    `${COLORS.warning}Connecting to MongoDB ${
      isTesting ? 'locally' : 'remote'
    }`,
  );

  return { uri: URL };
};
