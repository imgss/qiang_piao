
const puppeteer = require('puppeteer');
const month = '二月';
const day = '13';
(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('https://kyfw.12306.cn/otn/login/init');
  await page.type('#username', 'ggggssss')
  await  page.type('#password', '')
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
  //填写表单
  await page.evaluate((month, day) => {
    let cals = document.querySelectorAll('.cal');
    let target = Array.from(cals).filter((cal) => cal.querySelector('.month input').value === month)[0];
    let days = target.querySelectorAll('.cal-cm .cell')
    let theDay = Array.from(days).filter(dayel => dayel.innerText === day + '\n')[0];
    theDay.click()
  }, month, day)
  //点击查询
  await page.tap('#query_ticket')
  //查找车次，席位，是否可预订
  //循环查询
  setInterval(async () => {
    await page.tap('#query_ticket');
    await page.waitForSelector('tr[datatran]');
    let tra = await page.$('tr[datatran]')
    console.log(tra && tra.id)
    let tr = await page.evaluate(() => {
      var train  = document.querySelector("[datatran=\"K1102\"]") 
      console.log(train)
      if(train){
        let tr = document.querySelector('#'+document.querySelector("[datatran=\"K1102\"]").id.replace('price','ticket'))//查出k1102所在的行
        if(tr){
          return tr
        }
      }
      //let yuding_btns = document.getElementById('queryLeftTable').querySelectorAll('td:last-child a');
    })
    console.log(tr)
  }, 3000)

  // await browser.close();
})();