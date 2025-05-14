import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '@cucumber/cucumber';
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

interface CustomWorld extends World {
  page: Page;
  currentPage?: any; // For price verification across different pages
}

let loginPage: LoginPage;

// Navigation steps
Given('I am on the products page', async function(this: CustomWorld) {
  await expect(this.page).toHaveURL(/.*inventory.html/);
});

// Authentication steps
Given('I am logged in as a standard user', async function(this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.navigate();
  await this.page.waitForLoadState('load');
  await this.page.waitForSelector('[data-test="username"]', { state: 'visible' });
  await loginPage.login('standard_user', 'secret_sauce');
});

// Common verification steps
Then('the item {string} has a price of {string}', async function(itemName: string, expectedPrice: string) {
  await this.page.waitForSelector('.inventory_list', { state: 'visible', timeout: 15000 });
  const price = await this.currentPage?.getProductPrices(itemName);
  expect(price, `Price for "${itemName}" should be ${expectedPrice}`).toBe(expectedPrice);
});

// URL verification
Then('I should be on the {string} page', async function(this: CustomWorld, pageName: string) {
  const urlMap: { [key: string]: string } = {
    'products': 'inventory.html',
    'cart': 'cart.html',
    'checkout': 'checkout-step-one.html',
    'checkout confirmation': 'checkout-complete.html'
  };
  await expect(this.page).toHaveURL(new RegExp(`.*${urlMap[pageName]}`));
});

// Common data table processing utility
export const processDataTable = (dataTable: any): string[] => {
  return dataTable.raw().map((row: string[]) => row[0].trim());
}; 