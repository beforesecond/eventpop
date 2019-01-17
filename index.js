const puppeteer = require('puppeteer')
const { step, action, pending } = require('prescript')
const delay = require('delay')

function getPage(state) {
  /** @type {import('puppeteer').Page} */
  const page = state.page
  return page
}

async function retry(f, n = 3) {
  let error
  for (let i = 0; i < n; i++) {
    try {
      return await f()
    } catch (e) {
      error = e
    }
  }
  throw error
}

step('Open browser', () =>
  action(async state => {
    state.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
  })
)

step('Go to eventpop.com', () =>
  action(async state => {
    /** @type {import('puppeteer').Browser} */
    const browser = state.browser
    const page = await browser.newPage()
    const config = JSON.parse(
      require('fs').readFileSync('./.login.json', 'utf8')
    )
    const url = config.url
    await retry(async () => {
      await page.goto(url, {
        timeout: 10000
      })
      state.page = page
    })
  })
)
step('click login', () =>
  action(async state => {
    const page = getPage(state)
    try {
      await retry(async () => {
        await page.waitForSelector('a.btn.navbar-btn.open-signin-modal', {
          timeout: 5000,
          visible: true
        })
        await page.click('a.btn.navbar-btn.open-signin-modal')
      })
    } catch (e) {
      console.log(e)
    }
  })
)

step('input login email and password', () => {
  action(async state => {
    const page = getPage(state)
    const config = JSON.parse(
      require('fs').readFileSync('./.login.json', 'utf8')
    )
    await page.waitForSelector('div#signin-modal', {
      timeout: 5000,
      visible: true
    })
    const email = config.email
    const password = config.password
    await page.type('input[id="user_email"]', email)
    await page.type('input[id="user_password"]', password)
    await page.$eval('form#new_user', form => form.submit())
  })
})

step('select ticket and confirm.', () => {
  action(async state => {
    const page = getPage(state)
    await retry(async () => {
      await page.waitForSelector('form#place-order', {
        timeout: 5000,
        visible: true
      })
    })
    try {
      await page.select('select', '1')
      await page.$eval('form#place-order', form => form.submit())
      await retry(async () => {
        await page.waitForSelector('button#confirm', {
          timeout: 5000,
          visible: true
        })
      })
      await page.click('button#confirm')
      await page.click('button#confirm')
      await page.click('button#confirm')
    } catch (e) {
      console.log(e)
    }
  })
})

step('Close browser', () =>
  action(async state => {
    await delay(3000)
    /** @type {import('puppeteer').Browser} */
    const browser = state.browser
    browser.close()
  })
)
