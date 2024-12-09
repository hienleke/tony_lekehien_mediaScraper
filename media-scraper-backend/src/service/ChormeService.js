const puppeteer = require('puppeteer');

let browser;

const getBrowserInstance = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('Chromium browser started');
  }
  return browser;
};

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
    console.log('Chromium browser closed');
  }
};

module.exports = { getBrowserInstance, closeBrowser };
