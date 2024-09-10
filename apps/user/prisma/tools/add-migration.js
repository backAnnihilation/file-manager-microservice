const { execSync } = require('child_process');
const { join } = require('path');

const migrationName = process.argv[2];

if (!migrationName) {
  throw new Error(`Migration name wasn't provided`);
}

const userDirectory = join(__dirname, '..', '..');

const command = `npx prisma migrate dev --name ${migrationName} --schema=./prisma/schemas`;

process.chdir(userDirectory);

execSync(command, { stdio: 'inherit' });
