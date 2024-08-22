/*
  Warnings:

  - You are about to drop the column `device_id` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `rt_expiration_date` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `rt_issued_at` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent_info` on the `UserSession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `UserAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `UserSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `UserSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rtExpirationDate` to the `UserSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rtIssuedAt` to the `UserSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgentInfo` to the `UserSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSession" DROP COLUMN "device_id",
DROP COLUMN "refresh_token",
DROP COLUMN "rt_expiration_date",
DROP COLUMN "rt_issued_at",
DROP COLUMN "user_agent_info",
ADD COLUMN     "deviceId" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "rtExpirationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "rtIssuedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAgentInfo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_email_key" ON "UserAccount"("email");
