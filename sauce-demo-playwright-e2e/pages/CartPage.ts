import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private selectors = {
    cartLink: '.shopping_cart_link',
    cartBadge: '.shopping_cart_badge',
    cartItem: '.cart_item',
    cartItemName: '.inventory_item_name',
    cartItemPrice: '.inventory_item_price',
    removeButton: '.cart_button',
    continueShoppingButton: '[data-test="continue-shopping"]',
    checkoutButton: '[data-test="checkout"]',
    addToCartButton: (productName: string) => 
      `//div[text()="${productName}"]/ancestor::div[contains(@class, "inventory_item")]//button[contains(@class, "btn_inventory")]`,
    removeFromCartButton: (productName: string) => 
      `//div[text()="${productName}"]/ancestor::div[contains(@class, "cart_item")]//button[contains(@class, "cart_button")]`
  };

  async addToCart(productName: string): Promise<void> {
    const addButton = this.page.locator(this.selectors.addToCartButton(productName));
    const isVisible = await addButton.isVisible();
    if (!isVisible) {
      throw new Error(`Product "${productName}" not found on the page`);
    }
    await addButton.click();
    await this.page.waitForTimeout(100); // Small delay for animation
  }

  async goToCart(): Promise<void> {
    await this.click(this.selectors.cartLink);
    await this.page.waitForURL(/.*cart.html/);
  }

  async getCartItems(): Promise<string[]> {
    await this.waitForElement(this.selectors.cartItem);
    return await this.page.locator(this.selectors.cartItemName).allInnerTexts();
  }

  async getCartItemCount(): Promise<number> {
    try {
      const badge = await this.page.locator(this.selectors.cartBadge);
      if (await badge.isVisible()) {
        return parseInt(await badge.innerText());
      }
      return 0;
    } catch {
      return 0;
    }
  }

  async removeFromCart(productName: string): Promise<void> {
    const removeButton = this.page.locator(this.selectors.removeFromCartButton(productName));
    const isVisible = await removeButton.isVisible();
    if (!isVisible) {
      throw new Error(`Product "${productName}" not found in the cart`);
    }
    await removeButton.click();
    await this.page.waitForTimeout(100); // Small delay for animation
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const cartItems = await this.getCartItems();
    return cartItems.includes(productName);
  }

  async getCartItemPrice(productName: string): Promise<string | null> {
    const cartItem = this.page.locator(this.selectors.cartItem)
      .filter({ hasText: productName });
    
    if (await cartItem.count() === 0) return null;
    
    const priceElement = cartItem.locator(this.selectors.cartItemPrice);
    return await priceElement.innerText();
  }

  async continueShopping(): Promise<void> {
    await this.click(this.selectors.continueShoppingButton);
    await this.page.waitForURL(/.*inventory.html/);
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.selectors.checkoutButton);
    await this.page.waitForURL(/.*checkout-step-one.html/);
  }
} 