
const puppeteer = require('puppeteer');
const month = '二月';
const day = '17';
(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('https://kyfw.12306.cn/otn/login/init')
  await page.type('#username', 'ggggssss')
  await  page.type('#password', '')
  await page.waitForNavigation({
    waitUntil: 'domcontentloaded'
  })
  console.log(page.url())
  console.log('填写验证码后登录')
  await page.waitForNavigation({
    waitUntil: 'load'
  })
  await  page.waitForSelector('#selectYuding,#my12306page')
  await page.goto('https://kyfw.12306.cn/otn/leftTicket/init')
  await page.evaluate(() => {
    document.querySelector('#fromStation').value = 'SHH';
    document.querySelector('#toStation').value = 'XXF';
  })
  await page.tap('#date_icon_1');
  //填写表单
  console.log('开始填写表单');
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
  console.log('开始循环查询');
  let timer = setInterval(async () => {
    await page.tap('#query_ticket');
    await page.waitForSelector('tr[datatran]');
    let tra = await page.$('[datatran="K1102"]');
    let tr = await page.evaluate(() => {
      var trainId  = document.querySelector("[datatran=\"K1102\"]").id
      let tr = document.querySelector('#'+trainId.replace('price','ticket'))//查出k1102所在的行
      let yuding_btns = tr.querySelector('td:last-child a')//看有没有预定的btn
      if(yuding_btns){
        console.log('有票')
        yuding_btns.click()
      }else{
        console.log('没票')
      }
      //let yuding_btns = document.getElementById('queryLeftTable').querySelectorAll('td:last-child a');
    })
    // console.log('暂无余票',tr)
  }, 3000)

  await page.waitForNavigation({
    waitUntil: 'load'
  })
  clearInterval(timer)
  await page.tap('#normalPassenger_0')
  // await browser.close();
})();