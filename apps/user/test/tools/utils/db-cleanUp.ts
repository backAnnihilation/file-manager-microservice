import { DatabaseService } from '../../../src/core/db/prisma/prisma.service';

export const databaseCleanUp = async (dbService: DatabaseService) => {
  await dbService.$transaction([
    dbService.userProfile.deleteMany(),
    dbService.userSession.deleteMany(),
    dbService.post.deleteMany(),
    dbService.userAccount.deleteMany(),
  ]);
};
