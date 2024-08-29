import { DatabaseService } from '../../../core/db/prisma/prisma.service';

export const databaseCleanUp = async (dbService: DatabaseService) => {
  await dbService.$transaction([
    dbService.userSession.deleteMany(),
    dbService.userAccount.deleteMany(),
  ]);
};
