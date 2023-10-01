const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const dataFilteration = require("./dataFilteration");

puppeteer.use(StealthPlugin());

const obj = {
  isRoundtrip: true,
  cabinClass: "Economy",
  pax: {
    adults: 1,
    children: 0,
    infants: 0,
    infantsOnLap: 0,
  },
  flyFrom: " CCU",
  flyTo: "LHR",
  departureDate: " 10-10",
  returnDate: " 10-12",
};

async function search(url) {
  console.log("Running tests..");

  // const browser = await puppeteer.launch({ headless: false })
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-stable",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    headless: true,
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, obj);

    const roundTrip = 'div[role="search"] > div:nth-child(2) > div > div:nth-child(2) > div:last-child > div > div > div:last-child > div > div > div:nth-child(1) > div:nth-child(2) > div > div >div > div > div';
    const trip = 'div[role="search"] > div:nth-child(2) > div > div:nth-child(2) > div:last-child > div > div > div:last-child > div > div > div:nth-child(1) > div:nth-child(2) > div > div >div > div > div:nth-child(2) > ul > li';
    const addButton = 'div[role="search"] > div:nth-child(2) > div:first-child > div:first-child > div:nth-child(2) > div > div:last-child > ul > li';
    const cabinClass = 'div[role="search"] > div:nth-child(2) > div:first-child > div:first-child > div:nth-child(3) > div > div > div > div:nth-child(1)';
    const cabinClassLi = 'div[role="search"] > div:nth-child(2) > div:first-child > div:first-child > div:nth-child(3) > div > div > div > div:nth-child(2) > ul > li';
    const flyFrom = await page.$('div[role="search"] > div:nth-child(2) > div > div:nth-child(2) > div:first-child > div:first-child > div > div > div:first-child > div > div > input');
    const flyFromInput = 'div[role="search"] > div:nth-child(2) > div > div:nth-child(2) > div:first-child > div:first-child > div > div > div:first-child > div > div > input';
    const flyLi = 'div[role="search"] > div:nth-child(2) > div > div:nth-child(2) > div:first-child > div:nth-child(6) > div:nth-child(4) > ul > li:first-child';
    const flyToInput = 'div[role="search"] > div:nth-child(2) > div > div:nth-child(2) > div:first-child > div:nth-child(4) > div:first-child  > div > div > div > div:first-child > input';
    const departureDateInput = await page.$('div[role="search"] > div:nth-child(2) > div > div:nth-child(2) > div:last-child > div > div > div:first-child > div > div > div:first-child > div > div:first-child > div > input');
    const departureDate = 'div[role="search"] > div:nth-child(2) > div > div:nth-child(2) > div:last-child > div > div > div:last-child > div > div:nth-child(2) > div > div > div > div > input';
    const returnDateInput2 = 'div[role="search"] > div:nth-child(2) > div > div:nth-child(2) > div:last-child > div > div > div:last-child > div > div:nth-child(2) > div > div > div:nth-child(2) > div > input';
    const people = 'div[role="search"] > div:nth-child(2) > div:first-child > div:first-child > div:nth-child(2) > div > div:first-child > div > button';
    const donePax = 'div[role="search"] > div:nth-child(2) > div:first-child > div:first-child > div:nth-child(2) > div > div:last-child > ul ~ div > button:first-child';
    const doneDate = 'div[role="search"] > div:nth-child(2) > div > div:nth-child(2) > div:last-child > div > div > div:last-child > div > div:nth-child(3) > div:nth-child(3) > div > button';
    const exploreButton = 'div[role="search"] > div:last-child > div > button';

    // ! PEOPLE
    await page.click(people);
    if (obj.pax.adults > 1) {
      await page.waitForSelector(
        `${addButton}:nth-child(1) > div > div > span:nth-child(3) button`
      );
      for (let i = 0; i < obj.pax.adults - 1; i++) {
        await page.click(
          `${addButton}:nth-child(1) > div > div > span:nth-child(3) button`
        );
      }
    }
    if (obj.pax.children) {
      await page.waitForSelector(
        `${addButton}:nth-child(2) > div > div > span:nth-child(3) button`
      );
      for (let i = 0; i < obj.pax.children; i++) {
        await page.click(
          `${addButton}:nth-child(2) > div > div > span:nth-child(3) button`
        );
      }
    }
    if (obj.pax.infants) {
      await page.waitForSelector(
        `${addButton}:nth-child(3) > div > div > span:nth-child(3) button`
      );
      for (let i = 0; i < obj.pax.infants; i++) {
        await page.click(
          `${addButton}:nth-child(3) > div > div > span:nth-child(3) button`
        );
      }
    }
    await page.waitForSelector(donePax);
    await page.click(donePax);

    // ! PLACE
    await flyFrom.click({ clickCount: 3 });
    await page.type(flyFromInput, obj.flyFrom, { delay: 400 });
    await page.waitForSelector(flyLi, { visible: true });
    await page.click(flyLi);

    await page.type(flyToInput, obj.flyTo, { delay: 400 });
    await page.waitForSelector(flyLi, { visible: true });
    await page.click(flyLi);

    // ! DATE
    await departureDateInput.click({ clickCount: 1 });
    await page.type(departureDate, obj.departureDate, { delay: 400 });
    if (obj.isRoundtrip) {
      await page.type(returnDateInput2, obj.returnDate, { delay: 400 });
      await page.click(roundTrip);
      await page.waitForSelector(`${trip}:nth-child(2)`, { visible: true });
      await page.click(`${trip}:nth-child(2)`);
    } else {
      await page.click(roundTrip);
      await page.waitForSelector(`${trip}:nth-child(3)`, { visible: true });
      await page.click(`${trip}:nth-child(3)`);
    }
    await page.click(doneDate);

    // ! CABINCLASS
    await page.click(cabinClass);
    if (obj.cabinClass === "Economy") {
      await page.click(`${cabinClassLi}:nth-child(2)`);
    } else if (obj.cabinClass === "Premium economy") {
      await page.click(`${cabinClassLi}:nth-child(3)`);
    } else if (obj.cabinClass === "Business") {
      await page.click(`${cabinClassLi}:nth-child(4)`);
    } else {
      await page.click(`${cabinClassLi}:nth-child(5)`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.waitForSelector(exploreButton, { visible: true });
    await page.click(exploreButton);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    const otherFlightsMore =
      'div[role="main"] > div:last-child > ul > li:last-child button';
    await page.waitForSelector(otherFlightsMore, { visible: true });
    await page.click(otherFlightsMore);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await page.waitForSelector(otherFlightsMore, { visible: true });
    const bestFlightsDiv = await page.$x(
      '//div[h3[contains(text(), "Best departing flights")]]'
    );
    const otherFlightsDiv = await page.$x(
      '//div[h3[contains(text(), "Other departing flights")]]'
    );

    const flightData = [];
    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (bestFlightsDiv.length > 0) {
      const [firstMatchingDiv] = bestFlightsDiv;
      const bestLi = await firstMatchingDiv.$$("li");
      for (const childElement of bestLi) {
        const textContent = await childElement.evaluate(
          (element) => element.textContent
        );
        flightData.push(textContent);
      }
    } else {
      console.log("No matching div found.");
    }
    if (otherFlightsDiv.length > 0) {
      const [firstMatchingDiv] = otherFlightsDiv;
      const otherLi = await firstMatchingDiv.$$("li");
      const otherFlightsLi = otherLi.slice(0, -1);
      for (const childElement of otherFlightsLi) {
        const textContent = await childElement.evaluate(
          (element) => element.textContent
        );
        flightData.push(textContent);
      }
    } else {
      console.log("No matching div found.");
    }

    // console.log(flightData)
    // console.log(flightData.length)
    dataFilteration(flightData);
  } catch (error) {
    console.error("Error:", error.message, error);
  } finally {
    await browser.close();
    console.log(`Browser closed, work done. ✨`);
  }
}

search(
  "https://www.google.com/travel/flights?tcfs&ved=2ahUKEwiY6pSk-quBAxXgqGYCHfI1DtUQ0I8EegQIAxAK&ictx=2&authuser=0",
  obj
);
