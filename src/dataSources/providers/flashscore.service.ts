import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { DateTime } from 'luxon';
import { IDataProvider } from '../interfaces/baseDataProvider.interface';
import { EventDataRaw } from '../interfaces/odds.interface';

@Injectable()
export class FlashscoreProviderService implements IDataProvider {
  async getTodaysOdds(): Promise<EventDataRaw[]> {
    const browser = await puppeteer.launch();
    const todaysMatches = await this.getTodaysMatches(browser);
    const todaysOdds = new Array<EventDataRaw>();
    const l = todaysMatches.length;
    for (const match of todaysMatches) {
      const odds = await this.getOddsForMatch(browser, match);
      if (!odds) {
        Logger.verbose(`Skipped ${match}`);
      } else {
        Logger.verbose(
          `Got match ${todaysOdds.length + 1} of ${l} | ${odds.leagueName} | ${
            odds.homeName
          } - ${odds.awayName}`,
        );
        todaysOdds.push(odds);
      }
    }
    return todaysOdds;
  }

  async getOddsForMatch(browser: Browser, url: string): Promise<EventDataRaw> {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    //get event date
    const startDateText = await page.$eval(
      '.duelParticipant__startTime > div',
      (element) => element.innerHTML,
    );
    const startDate = DateTime.fromFormat(
      startDateText,
      'dd.MM.yyyy HH:mm',
    ).setZone('Europe/Warsaw');
    const startTimestamp = startDate.toUnixInteger();

    //skip event if it already begun
    if (startDate <= DateTime.now()) {
      return;
    }

    //click show more button if one exists
    try {
      await page.$eval('a.showMore', (button) => button.click());
      await page.waitForSelector('.ui-table__row');
    } catch (err) {}

    //get event data
    const leagueNamePromise = page.$eval(
      '.tournamentHeader__country > a',
      (element) => element.innerText.split(' - ')[0].toLowerCase(),
    );
    const homeNamePromise = page.$eval(
      '.duelParticipant__home > .participant__participantNameWrapper > .participant__participantName > a',
      (element) => element.innerHTML,
    );
    const awayNamePromise = page.$eval(
      '.duelParticipant__away > .participant__participantNameWrapper > .participant__participantName > a',
      (element) => element.innerHTML,
    );

    //get odds
    const oddsPromise = page.$$eval('.ui-table__row', (rows) => {
      const data = rows.map((row) => {
        const bookmaker = row
          .querySelector('.bookmaker > a')
          .getAttribute('title');
        const odds = [...row.querySelectorAll('.oddsCell__odd  > span')].map(
          (element) => {
            const text = element.textContent;
            return parseFloat(text);
          },
        );
        return { bookmaker, odds };
      });
      return data;
    });

    const [leagueName, homeName, awayName, odds] = await Promise.all([
      leagueNamePromise,
      homeNamePromise,
      awayNamePromise,
      oddsPromise,
    ]);
    await page.close();
    return { leagueName, startTimestamp, homeName, awayName, odds };
  }

  async getTodaysMatches(browser: Browser): Promise<string[]> {
    const page = await browser.newPage();
    await page.goto('https://www.flashscore.pl', {
      waitUntil: 'networkidle2',
    });

    //click every accordion button to reveal all matches happening today
    await page.$$eval(
      `xpath=//button[contains(., 'pokaż spotkania')]`,
      (buttons) => {
        buttons.forEach((button: HTMLElement) => button.click());
      },
    );

    //get href attribute of every .eventRowLink
    const matchHandles = await page.$$('a.eventRowLink');
    const hrefPromises = matchHandles.map(async (match) => {
      const href = await match.getProperty('href');
      return href.jsonValue();
    });
    const todaysMatches = await Promise.all(hrefPromises);

    await page.close();
    return todaysMatches;
  }
}
