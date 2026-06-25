// pages/QrCodesPage.js

class QrCodesPage {
  constructor(page) {
    this.page = page;

    this.twocentsPlusMenu = page.locator('//span[text()="Twocents Plus"]');
    this.switchToCustomerExperience = page.locator(
      '//span[text()="Switch to Customer Experience"]'
    );
    this.gotItPopupButton = page.getByRole('button', { name: 'Got it!' });
    this.nucleusLogo = page.locator('//img[@alt="Nucleus"]');

    // ── Table locators ──
    this.businessRows = page.locator('table tbody tr.bg-grey\\/80');
  }

  // ── Navigation from post-login landing → QR codes admin page ──
  async navigateToQrCodesPage(baseUrl) {
    await this.twocentsPlusMenu.click();
    await this.switchToCustomerExperience.click();
    await this.dismissWelcomePopupIfPresent();
    await this.nucleusLogo.click();
    await this.page.goto(`${baseUrl}/admin/qr-codes`);
  }

  async dismissWelcomePopupIfPresent() {
    try {
      await this.gotItPopupButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.gotItPopupButton.click();
      await this.gotItPopupButton.waitFor({ state: 'hidden' });
    } catch {
      console.log('Welcome popup did not appear — continuing.');
    }
  }

  async waitForTableToLoad() {
    await this.businessRows.first().waitFor({ state: 'visible', timeout: 15000 });
    return await this.businessRows.count();
  }

  // ── Per-row helpers (kept small and dynamic — no hardcoded row index) ──

  getRow(index) {
    return this.businessRows.nth(index);
  }

  async getRowLabels(row) {
    const qrName = (await row.locator('td').nth(0).innerText()).trim();
    const businessName = (await row.locator('td').nth(1).innerText()).trim();
    return { qrName, businessName };
  }

  async expandNotesPanel(row) {
    const notesButton = row.locator('button:has-text("Notes")');
    await notesButton.click();
    return notesButton;
  }

  getNotesPanel(row) {
    return row.locator('xpath=following-sibling::tr[1]');
  }

  async isPanelExpanded(panelRow) {
    return await panelRow
      .waitFor({ state: 'visible', timeout: 3000 })
      .then(() => true)
      .catch(() => false);
  }

  async hasAddNoteOption(panelRow) {
    const addNoteBtn = panelRow.getByText('Add note', { exact: true });
    const exists = await addNoteBtn.count().then(c => c > 0).catch(() => false);
    return { addNoteBtn, exists };
  }

  async isFullyInViewport(locator) {
    return await locator
      .evaluate(el => {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
          rect.top >= 0 &&
          rect.bottom <= viewportHeight &&
          rect.left >= 0 &&
          rect.right <= viewportWidth &&
          rect.width > 0 &&
          rect.height > 0
        );
      })
      .catch(() => false);
  }

  async collapseNotesPanel(notesButton, panelRow) {
    await notesButton.click().catch(() => {});
    await panelRow.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }

  async addNote(panelRow, addNoteBtn, noteText) {
    await addNoteBtn.click();

    const noteInput = panelRow.getByRole('textbox', { name: 'Write note...' });
    await noteInput.waitFor({ state: 'visible' });
    await noteInput.pressSequentially(noteText, { delay: 20 });

    const saveButton = panelRow.locator('button[class*="bg-black/70"]');
    await saveButton.waitFor({ state: 'visible' });
    await saveButton.isEnabled();
    await saveButton.click();
  }

  /**
   * Walks every row in the table, looking for the first add note button
   */
  async addNoteToFirstEligibleRow(noteText) {
    const totalRows = await this.waitForTableToLoad();
    console.log(`Total Rows: ${totalRows}`);

    for (let i = 0; i < totalRows; i++) {
      const row = this.getRow(i);
      await row.scrollIntoViewIfNeeded();

      const { qrName, businessName } = await this.getRowLabels(row);
      console.log(`Checking ${i + 1}: QR="${qrName}" | Business="${businessName}"`);

      const notesButton = await this.expandNotesPanel(row);
      const panelRow = this.getNotesPanel(row);

      if (!(await this.isPanelExpanded(panelRow))) {
        console.log('Panel not expanded, skipping...');
        continue;
      }

      const { addNoteBtn, exists } = await this.hasAddNoteOption(panelRow);
      console.log(`"Add note" exists in DOM: ${exists}`);

      if (!exists) {
        await notesButton.click().catch(() => {});
        continue;
      }

      await panelRow.scrollIntoViewIfNeeded();

      const isVisible = await this.isFullyInViewport(addNoteBtn);
      console.log(`"Add note" visible in viewport: ${isVisible}`);

      if (!isVisible) {
        console.log('Not fully in viewport → collapsing & continuing');
        await this.collapseNotesPanel(notesButton, panelRow);
        continue;
      }

      console.log(`FOUND ROW ${i + 1}`);
      await this.addNote(panelRow, addNoteBtn, noteText);
      console.log('Note saved successfully');

      return { recordNumber: i + 1, businessName, qrName };
    }

    return { recordNumber: -1, businessName: '', qrName: '' };
  }
}

module.exports = { QrCodesPage };