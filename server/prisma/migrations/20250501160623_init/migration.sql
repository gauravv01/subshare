-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "allowedCountries" TEXT[],
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "privacyUrl" TEXT,
ADD COLUMN     "supportUrl" TEXT,
ADD COLUMN     "termsUrl" TEXT;
