-- AlterTable
ALTER TABLE "PortfolioItem" ADD COLUMN     "clientType" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "shootYear" INTEGER,
ADD COLUMN     "showOnHome" BOOLEAN NOT NULL DEFAULT true;
