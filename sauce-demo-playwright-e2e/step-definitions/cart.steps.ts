import { Given, When, Then } from '@cucumber/cucumber';
import { CartPage } from '../pages/CartPage';
import { World } from '@cucumber/cucumber';
import { Page } from '@playwright/test';
import { assertions } from '../utils/assertions';
import { dataProcessing } from '../utils/dataProcessing';
import { expect } from '@playwright/test';

interface CustomWorld extends World {
  page: Page;
  currentPage: any;
  cartPage?: CartPage;
}

// Make cartPage part of the World instance instead of global
declare module '@cucumber/cucumber' {
  interface World {
    cartPage?: CartPage;
  }
}

// Helper function to ensure cart page is initialized
function ensureCartPage(world: CustomWorld): CartPage {
  if (!world.cartPage) {
    throw new Error('Cart page is not initialized. Make sure to call "I initialize the cart page" step first.');
  }
  return world.cartPage;
}

When('I initialize the cart page', async function(this: CustomWorld) {
  this.cartPage = new CartPage(this.page);
  this.currentPage = this.cartPage;
});

When('I add {string} to the cart', async function(this: CustomWorld, productName: string) {
  const cartPage = ensureCartPage(this);
  await cartPage.addToCart(productName);
});

When('I add these products to cart:', async function(this: CustomWorld, dataTable: any) {
  const cartPage = ensureCartPage(this);
  const products = dataProcessing.processDataTable(dataTable);
  
  // Add each product to cart sequentially
  for (const productName of products) {
    try {
      await cartPage.addToCart(productName);
      // Small delay between adds to ensure proper state updates
      await this.page.waitForTimeout(500);
    } catch (e) {
      const error = e as Error;
      throw new Error(`Failed to add product "${productName}" to cart: ${error.message}`);
    }
  }
});

When('I add the following products to cart:', async function(this: CustomWorld, dataTable: any) {
  const cartPage = ensureCartPage(this);
  const products = dataProcessing.processDataTable(dataTable);
  
  for (const productName of products) {
    try {
      await cartPage.addToCart(productName);
      // Wait for the cart to update after each addition
      await this.page.waitForTimeout(1000);
    } catch (e) {
      const error = e as Error;
      throw new Error(`Failed to add product "${productName}" to cart: ${error.message}`);
    }
  }
});

When('I go to the cart', async function(this: CustomWorld) {
  const cartPage = ensureCartPage(this);
  await cartPage.goToCart();
});

When('I navigate to cart page', async function(this: CustomWorld) {
  const cartPage = ensureCartPage(this);
  await cartPage.goToCart();
});

When('I proceed to checkout', async function(this: CustomWorld) {
  const cartPage = ensureCartPage(this);
  await cartPage.proceedToCheckout();
});

Then('the cart badge should show {string} items', async function(this: CustomWorld, expectedCount: string) {
  const cartPage = ensureCartPage(this);
  const actualCount = await cartPage.getCartItemCount();
  await assertions.expectCount(actualCount, parseInt(expectedCount), 'items in cart');
});

Then('I should see {string} in the cart', async function(this: CustomWorld, productName: string) {
  const cartPage = ensureCartPage(this);
  const isInCart = await cartPage.isProductInCart(productName);
  await assertions.expectToBeVisible(isInCart, `Product "${productName}" should be in the cart`);
});

Then('I should not see {string} in the cart', async function(this: CustomWorld, productName: string) {
  const cartPage = ensureCartPage(this);
  const isInCart = await cartPage.isProductInCart(productName);
  await assertions.expectToBeVisible(!isInCart, `Product "${productName}" should not be in the cart`);
});

Then('I should see the following items in cart:', async function(this: CustomWorld, dataTable: any) {
  const cartPage = ensureCartPage(this);
  const expectedItems = dataProcessing.processDataTable(dataTable);
  const cartItems = await cartPage.getCartItems();
  
  await assertions.expectCount(cartItems.length, expectedItems.length, 'items in cart');
  
  for (const item of expectedItems) {
    await assertions.expectToContain(cartItems, item, 'Cart should contain');
  }
});

Then('the cart item {string} should cost {string}', async function(this: CustomWorld, productName: string, expectedPrice: string) {
  const cartPage = ensureCartPage(this);
  const actualPrice = await cartPage.getCartItemPrice(productName);
  await assertions.expectPriceToMatch(actualPrice, expectedPrice, productName);
});

Given('I have added {string} to the cart', async function(this: CustomWorld, productName: string) {
  const cartPage = ensureCartPage(this);
  await cartPage.addToCart(productName);
});

When('I remove {string} from the cart', async function(this: CustomWorld, productName: string) {
  const cartPage = ensureCartPage(this);
  await cartPage.removeFromCart(productName);
});

When('I continue shopping', async function(this: CustomWorld) {
  const cartPage = ensureCartPage(this);
  await cartPage.continueShopping();
});

Then('I should see {string} items in the cart', async function(this: CustomWorld, expectedCount: string) {
  const cartPage = ensureCartPage(this);
  const actualCount = await cartPage.getCartItemCount();
  expect(actualCount, `Cart should contain ${expectedCount} items, but found ${actualCount}`).toBe(parseInt(expectedCount));
}); 