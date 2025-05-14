import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class ProductsPage extends BasePage {
  private selectors = {
    productTitle: '.inventory_item_name',
    productPrice: '.inventory_item_price',
    inventoryList: '.inventory_list',
    inventoryItem: '.inventory_item',
    productDescription: '.inventory_item_description',
    productLabel: '.product_label',
    sortDropdown: '[class="product_sort_container"]'
  };

  async getVisibleProducts(): Promise<string[]> {
    await this.waitForElement(this.selectors.inventoryList);
    return await this.page.locator(this.selectors.productTitle).allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    await this.waitForElement(this.selectors.inventoryList, { timeout: 10000 });
    const handles = await this.page.locator(this.selectors.productPrice).elementHandles();
    const prices: number[] = [];
    for (const handle of handles) {
      const raw = await handle.evaluate(el => el.textContent?.trim() || '');
      prices.push(parseFloat(raw.replace('$', '')));
    }
    return prices;
  }

  async searchProduct(productName: string): Promise<boolean> {
    const products = await this.getVisibleProducts();
    return products.some(p => p.toLowerCase().includes(productName.toLowerCase()));
  }

  async getProductCount(): Promise<number> {
    await this.waitForElement(this.selectors.inventoryItem);
    return await this.page.locator(this.selectors.inventoryItem).count();
  }

  async getProductPrice(productName: string): Promise<string | null> {
  const card = this.page.locator(this.selectors.productDescription).filter({ hasText: productName });
  await card.waitFor({ state: 'visible', timeout: 15000 });
  if (await card.count() === 0) return null;
  const priceEl = card.locator(this.selectors.productPrice);
  await priceEl.waitFor({ state: 'visible', timeout: 15000 });  
  const text = await priceEl.evaluate(el => el.textContent?.trim() || '');
  return text.replace(/\s+/g, '');
}

  async getSortedProductNames(): Promise<string[]> {
    return this.getVisibleProducts();
  }
}