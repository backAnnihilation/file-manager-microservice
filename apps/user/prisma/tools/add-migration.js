const execSync = require('child_process').execSync;
const path = require('path');

const migrationName = process.argv[2];

if (!migrationName) throw new Error(`Migration name wasn't provided`);

const userProjectPath = path.join(__dirname, '..', '..');

const command = `npx prisma migrate dev --name ${migrationName}`;

process.chdir(userProjectPath);

execSync(command, { stdio: 'inherit' });
