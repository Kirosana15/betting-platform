/*
  Warnings:

  - The `timestamp` column on the `BetOdds` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BetOdds" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "BetOdds_bookmaker_id_event_id_timestamp_key" ON "BetOdds"("bookmaker_id", "event_id", "timestamp");
