import { When, Then } from '@cucumber/cucumber';
import { ProductsPage } from '../pages/ProductsPage';
import { World } from '@cucumber/cucumber';
import { Page, expect } from '@playwright/test';
import { assertions } from '../utils/assertions';
import { dataProcessing } from '../utils/dataProcessing';

interface CustomWorld extends World {
  page: Page;
  currentPage: any;
  productsPage: ProductsPage;
}

let productsPage: ProductsPage;

When('I initialize the products page', async function(this: CustomWorld) {
  productsPage = new ProductsPage(this.page);
  this.currentPage = productsPage;
  this.productsPage = productsPage;
});

Then('I should see {int} products displayed', async function(expectedCount: number) {
  const actualCount = await productsPage.getProductCount();
  await assertions.expectCount(actualCount, expectedCount, 'products to be listed');
});

Then('the following products should be visible:', async function(dataTable: any) {
  const expectedProducts = dataProcessing.processDataTable(dataTable);
  const actualProducts = await productsPage.getVisibleProducts();

  for (const product of expectedProducts) {
    await assertions.expectToContain(actualProducts, product, 'Product should be visible in the list');
  }

  await assertions.expectCount(actualProducts.length, expectedProducts.length, 'products');
});

When('I search for product containing {string}', async function(searchTerm: string) {
  const found = await productsPage.searchProduct(searchTerm);
  await assertions.expectToBeVisible(found, `No products found matching search term "${searchTerm}"`);
});

Then('all visible products should contain {string}', async function(searchTerm: string) {
  const products = await productsPage.getVisibleProducts();
  for (const product of products) {
    const productContainsSearch = product.toLowerCase().includes(searchTerm.toLowerCase());
    await assertions.expectToBeVisible(productContainsSearch, `Product "${product}" should contain "${searchTerm}"`);
  }
});

// ✨ Clean and generic sort step
When('I select sort option {string}', async function(this: CustomWorld, sortOption: string) {
  await this.productsPage.sortProducts(sortOption);
});

// 🧪 Verify sorting results
Then('the products should be sorted by price in ascending order', async function(this: CustomWorld) {
  const prices = await this.productsPage.getProductPrices();
  const sortedPrices = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sortedPrices);
});

Then('the products should be sorted by price in descending order', async function(this: CustomWorld) {
  const prices = await this.productsPage.getProductPrices();
  const sortedPrices = [...prices].sort((a, b) => b - a);
  expect(prices).toEqual(sortedPrices);
});

Then('the products should be sorted by name in alphabetical order', async function(this: CustomWorld) {
  const names = await this.productsPage.getVisibleProducts();
  const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
  expect(names).toEqual(sortedNames);
});

Then('the item {string} should cost {string}', async function (productName: string, expectedPrice: string) {
  const actualPrice = await this.productsPage.getProductPrice(productName);
  expect(actualPrice).toEqual(expectedPrice);
});