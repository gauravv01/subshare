/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `lastFourDigits` on the `PaymentMethod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "expiryDate",
DROP COLUMN "lastFourDigits",
ADD COLUMN     "cardCvv" TEXT,
ADD COLUMN     "cardExpirationDate" TEXT,
ADD COLUMN     "cardHolderName" TEXT,
ADD COLUMN     "cardNumber" TEXT;
