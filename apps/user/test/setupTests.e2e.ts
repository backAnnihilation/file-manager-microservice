import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../core/config/configuration';
import { execSync } from 'child_process';
import { DatabaseService } from '../core/db/prisma/prisma.service';
import { join } from 'path';

let databaseService: DatabaseService;
let config: ConfigService<EnvironmentVariables>;
beforeAll(async () => {
  config = new ConfigService();
  const dbUrl = config.get('DATABASE_URL');
  
  const workerDir = join(__dirname, '..');

  execSync('npx prisma migrate dev', {
    env: { DATABASE_URL: dbUrl },
    cwd: workerDir,
  });

  databaseService = new DatabaseService({
    datasources: {
      db: { url: dbUrl },
    },
    log: ['query'],
  });
  console.log('connected to test db...');
});

export { databaseService };
