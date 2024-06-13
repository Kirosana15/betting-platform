import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { DateTime } from 'luxon';
import { IDataProvider } from '../interfaces/baseDataProvider.interface';
import { EventDataRaw } from '../interfaces/odds.interface';
import * as rxjs from 'rxjs';
import { mergeMap, Observable } from 'rxjs';

@Injectable()
export class FlashscoreProviderService implements IDataProvider {
  private _CONCURRENCY: number;
  private _LINK: string;
  constructor() {
    this._CONCURRENCY = parseInt(process.env.FLASHSCORE_CONCURRENCY || '3', 10);
    this._LINK = process.env.FLASHSCORE_LINK || 'https://www.flashscore.pl';
  }

  async getTodaysOdds(): Promise<Observable<EventDataRaw>> {
    const browser = await puppeteer.launch();
    const todaysMatches = await this.getTodaysMatches(browser);

    const observable = rxjs.from(todaysMatches).pipe(
      mergeMap(async (match) => {
        return this.getOddsForMatch(browser, match);
      }, this._CONCURRENCY),
      rxjs.finalize(() => browser.close()),
    );
    return observable;
  }

  async getOddsForMatch(browser: Browser, url: string): Promise<EventDataRaw> {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.duelParticipant__startTime > div');
    //get event date
    const startDateText = await page.$eval(
      '.duelParticipant__startTime > div',
      (element) => element.innerHTML,
    );
    const startDate = DateTime.fromFormat(
      startDateText,
      'dd.MM.yyyy HH:mm',
    ).setZone('Europe/Warsaw');
    const startTimestamp = startDate.toMillis();

    //skip event if it already begun
    if (startDate <= DateTime.now()) {
      await page.close();
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
    await page.goto(this._LINK, {
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
