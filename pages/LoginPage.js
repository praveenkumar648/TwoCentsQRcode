// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;

    // ── Locators (all in one place — if the UI changes, fix it here only) ──
    this.loginLink = page.locator('//a[text()="Login"]');
    this.countryCodeDropdown = page.locator('//button[@role="combobox"]');
    this.mobileNumberInput = page.locator('//input[@id="mobileNumber"]');
    this.submitButton = page.locator('//button[@type="submit"]');
    this.pinInput = page.locator('input[name="pin"]');
    this.continueButton = page.locator('//button[text()="Continue"]');
    this.heroHeading = page.locator(
      '//h1[text()="Give feedback to any business - privately."]'
    );
  }

  async open(baseUrl) {
    await this.page.goto(baseUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectOnHomePage() {
    await this.heroHeading.waitFor({ state: 'visible' });
  }

  async goToLoginForm() {
    await this.loginLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectCountryCode(code) {
    await this.countryCodeDropdown.click();
    await this.page.getByRole('listbox').getByText(code).click();
  }

  async enterMobileNumber(number) {
    await this.mobileNumberInput.fill(number);
  }

  async submitMobileNumber() {
    await this.submitButton.click();
  }

  async enterPin(pin) {
    await this.pinInput.fill(pin);
  }

  async confirmPin() {
    await this.continueButton.click();
  }

 async login({ baseUrl, countryCode, mobileNumber, pin }) {
    await this.open(baseUrl);
    await this.expectOnHomePage();
    await this.goToLoginForm();
    await this.selectCountryCode(countryCode);
    await this.enterMobileNumber(mobileNumber);
    await this.submitMobileNumber();
    await this.enterPin(pin);
    await this.confirmPin();
  }
}

module.exports = { LoginPage };