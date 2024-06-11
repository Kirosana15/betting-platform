-- CreateTable
CREATE TABLE "Bookmaker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Bookmaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetOdds" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "bookmaker_id" TEXT NOT NULL,
    "home_win_odds" DOUBLE PRECISION NOT NULL,
    "draw_odds" DOUBLE PRECISION NOT NULL,
    "away_win_odds" DOUBLE PRECISION NOT NULL,
    "timestamp" INTEGER NOT NULL,

    CONSTRAINT "BetOdds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BetOdds" ADD CONSTRAINT "BetOdds_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetOdds" ADD CONSTRAINT "BetOdds_bookmaker_id_fkey" FOREIGN KEY ("bookmaker_id") REFERENCES "Bookmaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
