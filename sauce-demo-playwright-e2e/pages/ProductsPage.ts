import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class ProductsPage extends BasePage {
  private selectors = {
    productTitle: '.inventory_item_name',
    productPrice: '.inventory_item_price',
    sortDropdown: '[data-test="product_sort_container"]',
    inventoryList: '.inventory_list',
    inventoryItem: '.inventory_item',
    productDescription: '.inventory_item_description',
    productLabel: '.product_label'
  };

  private optionMap: Record<string, 'az' | 'za' | 'lohi' | 'hilo'> = {
    'name ascending order': 'az',
    'name descending order': 'za',
    'price low to high': 'lohi',
    'price high to low': 'hilo',
    'price ascending order': 'lohi',
    'price descending order': 'hilo',
    'a to z': 'az',
    'z to a': 'za'
  };

  async getVisibleProducts(): Promise<string[]> {
    await this.waitForElement(this.selectors.inventoryList);
    return await this.page.locator(this.selectors.productTitle).allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    await this.waitForElement(this.selectors.inventoryList);
    const priceLocators = await this.page.locator(this.selectors.productPrice).elementHandles();

    const prices: number[] = [];
    for (const locator of priceLocators) {
      const parts = await locator.evaluate(el =>
        Array.from(el.childNodes).map(node => node.textContent || '').join('').trim()
      );
      const number = parseFloat(parts.replace('$', ''));
      prices.push(number);
    }

    return prices;
  }

  async searchProduct(productName: string): Promise<boolean> {
    const products = await this.getVisibleProducts();
    return products.some(product =>
      product.toLowerCase().includes(productName.toLowerCase())
    );
  }

  async sortProducts(sortOption: string): Promise<void> {
    const dropdown = this.page.locator(this.selectors.sortDropdown);
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toBeEnabled();

    const normalized = sortOption.toLowerCase();
    const mappedOption = this.optionMap[normalized];

    if (!mappedOption) {
      throw new Error(`Invalid sort option: "${sortOption}"`);
    }

    const initialProducts = await this.getVisibleProducts();

    await dropdown.selectOption(mappedOption);
    await this.waitForElement(this.selectors.inventoryList);

    await this.page.waitForFunction(
      (params: { selector: string; initial: string[] }) => {
        const products = Array.from(document.querySelectorAll(params.selector))
          .map(el => el.textContent || '');
        return JSON.stringify(products) !== JSON.stringify(params.initial);
      },
      { selector: this.selectors.productTitle, initial: initialProducts },
      { timeout: 10000 }
    );

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getProductCount(): Promise<number> {
    await this.waitForElement(this.selectors.inventoryItem);
    return await this.page.locator(this.selectors.inventoryItem).count();
  }

  async isProductVisible(productName: string): Promise<boolean> {
    const products = await this.getVisibleProducts();
    return products.includes(productName);
  }

  async getProductPrice(productName: string): Promise<string | null> {
    const productCard = this.page.locator(this.selectors.productDescription).filter({ hasText: productName });

    if (await productCard.count() === 0) return null;

    const priceElement = productCard.locator(this.selectors.productPrice);
    const priceText = await priceElement.evaluate(el =>
      Array.from(el.childNodes).map(node => node.textContent || '').join('').trim()
    );

    return priceText.replace(/\s+/g, '');
  }
}