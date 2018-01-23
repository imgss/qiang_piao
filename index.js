const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://kyfw.12306.cn/otn/login/init');
  await page.type('#username', 'ggggssss')
  await  page.type('#password', '')
  await page.waitForNavigation({
    waitUntil: 'load'
  })
    console.log(page.url())
  await  page.waitForSelector('#selectYuding')
  await page.goto('https://kyfw.12306.cn/otn/leftTicket/init')
  await page.type('#fromStationText','上海')
  await page.type('#toStationText','新乡')
  await page.tap('#query_ticket')
  // await browser.close();
})();