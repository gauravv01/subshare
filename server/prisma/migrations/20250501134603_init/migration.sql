-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'REVIEW');

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE';
