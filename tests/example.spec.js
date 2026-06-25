/*import { test, expect } from '@playwright/test';

test('Twocents - Add Note Flow with viewport validation', async ({ page }) => {

  // ─── 1. OPEN APP ─────────────────────────────────────────────
  await page.goto('https://staging-fe.mytwocents.io/');
  await page.waitForLoadState('domcontentloaded');

  await expect(
    page.locator('//h1[text()="Give feedback to any business - privately."]')
  ).toBeVisible();

  // ─── 2. LOGIN ────────────────────────────────────────────────
  await page.locator('//a[text()="Login"]').click();
  await page.waitForLoadState('domcontentloaded');

  await page.locator('//button[@role="combobox"]').click();
  await page.getByRole('listbox').getByText('+91').click();

  await page.locator('//input[@id="mobileNumber"]').fill('9916661319');
  await page.locator('//button[@type="submit"]').click();

  await page.locator('input[name="pin"]').fill('876985');
  await page.locator('//button[text()="Continue"]').click();

  // ─── 3. NAVIGATE ─────────────────────────────────────────────
  await page.locator('//span[text()="Twocents Plus"]').click();
  await page.locator('//span[text()="Switch to Customer Experience"]').click();

//closing the pop up
  const gotItBtn = page.getByRole('button', { name: 'Got it!' });
  try {
  await gotItBtn.waitFor({ state: 'visible', timeout: 5000 });
  await gotItBtn.click();
  await expect(gotItBtn).toBeHidden();
  } catch {
  console.log('Popup did not appear');
  }

  // ─── 4. QR PAGE ──────────────────────────────────────────────
  await page.locator('//img[@alt="Nucleus"]').click();
  await page.goto('https://staging-fe.mytwocents.io/admin/qr-codes');

  // ─── 5. TABLE LOAD ───────────────────────────────────────────
  const businessRows = page.locator('table tbody tr.bg-grey\\/80');

  await expect(businessRows.first()).toBeVisible({ timeout: 15000 });

  const totalRows = await businessRows.count();
  console.log(`Total Rows: ${totalRows}`);

  // ─── 6. LOOP ROWS ────────────────────────────────────────────
  let foundRecordNumber = -1;
  let foundBusinessName = '';
  let foundQrName = '';

  for (let i = 0; i < totalRows; i++) {
    const row = businessRows.nth(i);

    await row.scrollIntoViewIfNeeded();

    const qrName = (await row.locator('td').nth(0).innerText()).trim();
    const businessName = (await row.locator('td').nth(1).innerText()).trim();

    console.log(`Checking ${i + 1}: QR="${qrName}" | Business="${businessName}"`);

    // Expand Notes
    const notesBtn = row.locator('button:has-text("Notes")');
    await notesBtn.click();

    const panelRow = row.locator('xpath=following-sibling::tr[1]');

    const panelExpanded = await panelRow
      .waitFor({ state: 'visible', timeout: 3000 })
      .then(() => true)
      .catch(() => false);

    if (!panelExpanded) {
      console.log('Panel not expanded, skipping...');
      continue;
    }

    // Find Add Note
    const addNoteBtn = panelRow.getByText('Add note', { exact: true });

    const existsInDom = await addNoteBtn.count().then(c => c > 0).catch(() => false);
    console.log(`"Add note" exists in DOM: ${existsInDom}`);

    if (!existsInDom) {
      await notesBtn.click().catch(() => {});
      continue;
    }

    // ── Scroll panel into view before viewport check (matches POM) ──
    await panelRow.scrollIntoViewIfNeeded();

    // ── STRICT Viewport Check (aligned with POM logic) ──────────────
    const isTrulyVisible = await addNoteBtn.evaluate(el => {
      const rect           = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth  = window.innerWidth  || document.documentElement.clientWidth;

      return (
        rect.top    >= 0             &&
        rect.bottom <= viewportHeight &&
        rect.left   >= 0             &&
        rect.right  <= viewportWidth  &&
        rect.width  > 0              &&
        rect.height > 0
      );
    }).catch(() => false);

    console.log(`"Add note" visible in viewport: ${isTrulyVisible}`);

    if (!isTrulyVisible) {
      console.log('Not fully in viewport → collapsing & continuing');
      await notesBtn.click().catch(() => {});
      await panelRow.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      continue;
    }

    // ─── FOUND VALID ROW ───────────────────────────────────────
    foundRecordNumber = i + 1;
    foundBusinessName = businessName;
    foundQrName = qrName;

    console.log(`FOUND ROW ${foundRecordNumber}`);

    await addNoteBtn.click();

    const noteInput = panelRow.getByRole('textbox', {
      name: 'Write note...',
    });

    await expect(noteInput).toBeVisible();
    await noteInput.pressSequentially('QA Check - Passed', { delay: 20 });

    const saveBtn = panelRow.locator('button[class*="bg-black/70"]');

    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toBeEnabled();

    await saveBtn.click();

    console.log('Note saved successfully');

    break;
  }

  // ─── FINAL ASSERTION ─────────────────────────────────────────
  expect(foundRecordNumber).toBeGreaterThan(0);
});*/