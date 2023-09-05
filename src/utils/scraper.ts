// import puppeteer from "puppeteer";
import * as cheerio from 'cheerio';

//
// export const getTeamRobotName = async (teamNumber: string) => {
//   // Start a Puppeteer session with:
//   // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
//   // - no default viewport (`defaultViewport: null` - website page will in full width and height)
//   const browser = await puppeteer.launch({headless: "new"});
//
//   // Open a new page
//   const page = await browser.newPage();
//
//   // On this new page:
//   // - open the "http://quotes.toscrape.com/" website
//   // - wait until the dom content is loaded (HTML is ready)
//   await page.goto(`https://www.robotevents.com/teams/VRC/${teamNumber.toUpperCase()}`, {
//     waitUntil: "domcontentloaded",
//   });
//
//   try {
//
//     const current_element = await page.$('th ::-p-text(Robot Name:)');
//
//     const parent_node = await current_element?.getProperty('parentNode')
//
//     // @ts-ignore
//     const td_node = await parent_node.asElement().$('td');
//
//     // @ts-ignore
//     const team_name = await td_node.getProperty('innerText');
//
//     return team_name.jsonValue();
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

export const getTeamRobotNameCheerio = async (teamNumber: string) => {
  const response = await fetch(`https://www.robotevents.com/teams/VRC/${teamNumber.toUpperCase()}`);
  const html = await response.text();
  const $ = cheerio.load(html);

  try {
    const team_robot_name = $('th:contains("Robot Name:")').parent().find('td').text();
    return team_robot_name;
  } catch (error) {
    console.log(error);
    return null;
  }
}

