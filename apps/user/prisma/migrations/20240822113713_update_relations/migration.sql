-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "user_agent_info" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "rt_issued_at" TIMESTAMP(3) NOT NULL,
    "rt_expiration_date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
