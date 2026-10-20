// Screenshots of the site at phone size, incl. the table-of-contents drawer.
// Usage: node mobile-check.mjs <base url> <page path> <out dir>
import puppeteer from 'puppeteer-core'
const [base, pagePath, out] = process.argv.slice(2)
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})
const page = await browser.newPage()
await page.emulate({
  viewport: {width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true},
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
})
const errors = []
page.on('pageerror', e => errors.push(e.message))
const shot = async name => { await new Promise(r => setTimeout(r, 400)); await page.screenshot({path: `${out}/${name}.png`}) }

await page.goto(base + '/', {waitUntil: 'networkidle0'})
await shot('home')
await page.goto(base + pagePath, {waitUntil: 'networkidle0'})
const widths = await page.evaluate(() => ({doc: document.documentElement.scrollWidth, view: window.innerWidth}))
await shot('page')
await page.evaluate(() => window.scrollTo(0, 900))
await shot('page-scrolled')
await page.tap('.sidebar-toggle')
await shot('drawer-open')
// navigate via the drawer: open the first section, then tap its first page
const before = page.url()
const leaf = async () => {
  for (const b of await page.$$('.sidebar-content .sidebarButton')) {
    const isParent = await b.evaluate(el => !!el.querySelector('svg'))
    const active = await b.evaluate(el => el.classList.contains('active'))
    if (!isParent && !active) return b
  }
  return null
}
let target = await leaf()
if (!target) {
  const first = (await page.$$('.sidebar-content .sidebarButton'))[0]
  await first.tap()
  await new Promise(r => setTimeout(r, 500))
  await shot('drawer-expanded')
  target = await leaf()
}
if (target) await target.tap()
await new Promise(r => setTimeout(r, 1500))
const drawerOpenAfterNav = await page.evaluate(() => document.querySelector('.sidebar').classList.contains('is-open'))
await shot('after-nav')
console.log(JSON.stringify({widths, navigated: page.url() !== before, url: page.url(), drawerOpenAfterNav, errors}, null, 1))
await browser.close()
