// tests/addNote.spec.js
//
// SIMPLE VERSION — one file, two hooks:
//   beforeAll  -> log in ONCE, keep that same page open
//   afterAll   -> close the page (our "logout")
//
// No session files, no separate setup project. We just launch one
// browser/page in beforeAll and reuse that SAME page object for the
// test. This avoids any file read/write timing issues entirely.

const { test, expect, chromium } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { QrCodesPage } = require('../pages/QrCodesPage');
const { testData } = require('../utils/testData');

test.describe('Twocents - Add Note Flow', () => {
  let browser;
  let page;
  let qrCodesPage;

  // ── BEFORE SUITE: launch browser, log in once ─────────────────
  test.beforeAll(async () => {
    console.log('Starting "Add Note" test suite — logging in...');

    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.login({
      baseUrl: testData.baseUrl,
      countryCode: testData.login.countryCode,
      mobileNumber: testData.login.mobileNumber,
      pin: testData.login.pin,
    });

    qrCodesPage = new QrCodesPage(page);
    console.log('Login successful.');
  });

  test('should add a note to the first eligible business row', async () => {
    await qrCodesPage.navigateToQrCodesPage(testData.baseUrl);

    const result = await qrCodesPage.addNoteToFirstEligibleRow(testData.note.text);

    expect(result.recordNumber).toBeGreaterThan(0);
    console.log(
      `Note added to row #${result.recordNumber} (Business: ${result.businessName}, QR: ${result.qrName})`
    );
  });

  // ── AFTER SUITE: "logout" — there's no logout button in the app,
  //    so we just close the page/browser to end the session ──────
  test.afterAll(async () => {
    await page.close();
    await browser.close();
    console.log('Page closed. Finished "Add Note" test suite.');
  });
});