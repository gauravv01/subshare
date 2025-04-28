/*
  Warnings:

  - You are about to drop the column `allowedCountries` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `privacyUrl` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `supportUrl` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `termsUrl` on the `Service` table. All the data in the column will be lost.
  - The `category` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `accessEmail` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `accessNotes` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `accessPassword` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `autoRenew` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledAt` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currentMembers` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `nextBillingDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `ServicePlan` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `maxMembers` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maxMembers` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ServicePlan" DROP CONSTRAINT "ServicePlan_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_serviceId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "allowedCountries",
DROP COLUMN "features",
DROP COLUMN "privacyUrl",
DROP COLUMN "supportUrl",
DROP COLUMN "termsUrl",
DROP COLUMN "category",
ADD COLUMN     "category" TEXT,
ALTER COLUMN "maxMembers" SET NOT NULL,
ALTER COLUMN "maxMembers" SET DEFAULT 6;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "accessEmail",
DROP COLUMN "accessNotes",
DROP COLUMN "accessPassword",
DROP COLUMN "autoRenew",
DROP COLUMN "cancelledAt",
DROP COLUMN "currentMembers",
DROP COLUMN "nextBillingDate",
ADD COLUMN     "profileAssignment" TEXT,
ALTER COLUMN "cycle" SET DEFAULT 'MONTHLY',
ALTER COLUMN "maxMembers" SET NOT NULL,
ALTER COLUMN "maxMembers" SET DEFAULT 4,
ALTER COLUMN "serviceId" DROP NOT NULL;

-- DropTable
DROP TABLE "ServicePlan";

-- DropEnum
DROP TYPE "ServiceCategory";

-- CreateTable
CREATE TABLE "AccountCredential" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "cycle" "CycleType" NOT NULL DEFAULT 'MONTHLY',
    "features" TEXT[],
    "maxMembers" INTEGER NOT NULL DEFAULT 6,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountCredential_subscriptionId_key" ON "AccountCredential"("subscriptionId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountCredential" ADD CONSTRAINT "AccountCredential_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
