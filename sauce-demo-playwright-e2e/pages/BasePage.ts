import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string = '') {
    await this.page.goto(`/${path}`);
    await this.waitForPageLoad();
  }

  async waitForElement(selector: string, options = { timeout: 10000 }) {
    await this.page.waitForSelector(selector, options);
  }

  async click(selector: string) {
    await this.waitForElement(selector);
    await this.page.click(selector);
  }

  async fill(selector: string, text: string) {
    await this.waitForElement(selector);
    await this.page.fill(selector, text);
  }

  async getText(selector: string): Promise<string> {
    await this.waitForElement(selector);
    return await this.page.innerText(selector);
  }

  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.waitForElement(selector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getItemPrice(itemName: string): Promise<string> {
    const priceElement = await this.page.locator(`[data-test="item-${itemName}"] .inventory_item_price`);
    await this.waitForElement(`[data-test="item-${itemName}"]`);
    const price = await priceElement.textContent();
    return price || '';
  }

  async waitForPageLoad(): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.page.waitForLoadState('domcontentloaded')
    ]);
  }

  async waitForElementToBeStable(selector: string, options = { timeout: 10000 }): Promise<void> {
    await this.waitForElement(selector, options);
    await this.page.waitForFunction(
      (sel: string) => {
        const element = document.querySelector(sel);
        return element && window.getComputedStyle(element).opacity === '1';
      },
      selector,
      { timeout: options.timeout }
    );
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  protected async waitForElementWithTimeout(selector: string, timeout = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  protected async isElementVisible(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.isVisible();
  }

  protected async getElementText(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    await this.waitForElement(selector);
    const text = await element.textContent();
    return text || '';
  }

  protected async waitForElementToBeEnabled(selector: string, timeout = 10000): Promise<void> {
    await this.waitForElement(selector, { timeout });
    await this.page.waitForFunction(
      (sel: string) => {
        const element = document.querySelector(sel);
        return element && !element.hasAttribute('disabled');
      },
      selector,
      { timeout }
    );
  }
} 