-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "confirmationCode" TEXT NOT NULL,
    "confirmationExpDate" TIMESTAMP(3) NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL,
    "passwordRecoveryCode" TEXT,
    "passwordRecoveryExpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_userName_key" ON "UserAccount"("userName");
