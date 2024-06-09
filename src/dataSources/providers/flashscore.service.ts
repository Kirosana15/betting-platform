import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { ElementHandle } from 'puppeteer';

@Injectable()
export class FlashscoreProviderService {
  async getTodaysMatches() {
    Logger.log('Getting Flashscore matches');
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://www.flashscore.pl', {
        waitUntil: 'networkidle2',
      });

      // click every accordion button to reveal all matches happening today
      await page.$$eval(
        `xpath=//button[contains(., 'pokaż spotkania')]`,
        (buttons) => {
          buttons.forEach((button: HTMLElement) => button.click());
        },
      );

      // get href attribute of every .eventRowLink
      const matchHandles = await page.$$('a.eventRowLink');
      const hrefPromises = matchHandles.map(async (match) => {
        const href = await match.getProperty('href');
        return href.jsonValue();
      });
      const todaysMatches = await Promise.all(hrefPromises);

      await browser.close();
      return todaysMatches;
    } catch (err) {
      Logger.error(err);
    }
  }
}
