-- CreateEnum
CREATE TYPE "WithdrawalType" AS ENUM ('BANK_TRANSFER', 'PAYPAL');

-- CreateTable
CREATE TABLE "WithdrawalMethod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "WithdrawalType" NOT NULL,
    "provider" TEXT NOT NULL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "routingNumber" TEXT,
    "swiftCode" TEXT,
    "accountHolderName" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WithdrawalMethod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WithdrawalMethod" ADD CONSTRAINT "WithdrawalMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
