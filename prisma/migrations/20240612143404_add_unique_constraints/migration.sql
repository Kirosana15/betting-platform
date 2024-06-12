/*
  Warnings:

  - A unique constraint covering the columns `[bookmaker_id,event_id,timestamp]` on the table `BetOdds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Bookmaker` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[league_id,home_team_id,away_team_id,event_date]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `League` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BetOdds_bookmaker_id_event_id_timestamp_key" ON "BetOdds"("bookmaker_id", "event_id", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmaker_name_key" ON "Bookmaker"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Event_league_id_home_team_id_away_team_id_event_date_key" ON "Event"("league_id", "home_team_id", "away_team_id", "event_date");

-- CreateIndex
CREATE UNIQUE INDEX "League_name_key" ON "League"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
