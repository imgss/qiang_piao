const puppeteer = require('puppeteer');
const month = '二月';
const day = '13';
(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://kyfw.12306.cn/otn/login/init');
  await page.type('#username', 'ggggssss')
  await  page.type('#password', 'sg4027')
  await page.waitForNavigation({
    waitUntil: 'load'
  })
    console.log(page.url())
  await  page.waitForSelector('#selectYuding')
  await page.goto('https://kyfw.12306.cn/otn/leftTicket/init')
  await page.evaluate(() => {
    document.querySelector('#fromStation').value = 'SHH'
    document.querySelector('#toStation').value = 'XXF'
  })
  await page.tap('#date_icon_1');
  await page.evaluate((month, day) => {
    let cals = document.querySelectorAll('.cal');
    let target = Array.from(cals).filter((cal) => cal.querySelector('.month input').value === month)[0];
    let days = target.querySelectorAll('.cal-cm .cell')
    let theDay = Array.from(days).filter(dayel => dayel.innerText === day + '\n')[0];
    theDay.click()
  }, month, day)

  await page.tap('#query_ticket')
  // await browser.close();
})();