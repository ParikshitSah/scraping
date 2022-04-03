const puppeteer = require("puppeteer");
const xlsx = require("xlsx");

const loadMore =
  "#react-app > div > div > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-3 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-9.MuiGrid-grid-lg-9 > div > div > div.outlinedButton > button  > div > div > span";
// "#react-app > div > div > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-3 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-9.MuiGrid-grid-lg-9 > div > div:nth-child(2) > div.outlinedButton > button";
//const loadAgain ="#react-app > div > div > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-3 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-9.MuiGrid-grid-lg-9 > div > div:nth-child(2) > div.outlinedButton > button > div > div > span";

const pageTitle =
  // "#org-search-results > ul > div > div > a > div > div > span > div > div > div";
  //  "#org-search-results > ul > div > div > a > div > div > span > div > div > div ";
  "#org-search-results > ul > div > div > a > div > div > span > div > div > div:nth-child(2)";
//" #org-search-results > ul > div > div > a > div > div > span > div > div > div:last-child";


const pageLink ="#org-search-results > ul > div > div > a";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "https://boilerlink.purdue.edu/organizations?branches=77161&categories=7537"
  );

  while (await page.$(loadMore)) {
    await page.waitForSelector(loadMore);
    await page.waitForSelector(loadMore);
    await page.click(loadMore);
    await page.waitForSelector(loadMore);
  }

  // for(i=0;i<32;i++)
  // {

  //     await page.waitForSelector(loadMore);
  //     await page.waitForSelector(loadMore);

  //     await page.click(loadMore);
  //     await page.waitForSelector(loadMore);

  // }

  const Title = await page.$$eval(pageLink, (Title) =>
    Title.map((Title) => Title.href)
  );
  // const Title = await page.$eval(pageTitle, Title  => Title.textContent
  // );

  console.log(Title);
  //   const aoaTitle = Title.map(T => [T]);

  // const wb = xlsx.utils.book_new();
  // const ws = xlsx.utils.aoa_to_sheet(aoaTitle);

  // xlsx.utils.book_append_sheet(wb, ws);
  // xlsx.writeFile(wb, "PageInfo3.xlsx");
})();
