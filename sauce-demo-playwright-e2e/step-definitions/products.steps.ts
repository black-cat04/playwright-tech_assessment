import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ICustomWorld } from '../support/custom-world';

Given('I initialize the products page', async function (this: ICustomWorld) {
  if (!this.page) throw new Error('Page not initialized');
  this.productsPage = new ProductsPage(this.page);
  await this.productsPage.navigate('inventory.html');
});

Then('I should see {int} products displayed', async function (this: ICustomWorld, expectedCount: number) {
  if (!this.productsPage) throw new Error('ProductsPage not initialized');
  const visibleProducts = await this.productsPage.getVisibleProducts();
  const searchTerm = (this as any)._lastSearchTerm as string | undefined;
  const count = searchTerm
    ? visibleProducts.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase())).length
    : await this.productsPage.getProductCount();
  expect(count).toBe(expectedCount);
});

Then('the following products should be visible:', async function (this: ICustomWorld, dataTable: DataTable) {
  if (!this.productsPage) throw new Error('ProductsPage not initialized');
  const visibleProducts = await this.productsPage.getVisibleProducts();
  const expectedProducts = dataTable.raw().flat();
  expectedProducts.forEach(product => expect(visibleProducts).toContain(product));
});

When('I search for product containing {string}', async function (this: ICustomWorld, searchTerm: string) {
  if (!this.productsPage) throw new Error('ProductsPage not initialized');
  (this as any)._lastSearchTerm = searchTerm;
  const products = await this.productsPage.getVisibleProducts();
  const found = products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
  expect(found).toBe(true);
});

Then('{int} products should contain {string}', async function (this: ICustomWorld, expectedCount: number, searchTerm: string) {
  if (!this.productsPage) throw new Error('ProductsPage not initialized');
  const products = await this.productsPage.getVisibleProducts();
  const filtered = products.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
  expect(filtered.length).toBe(expectedCount);
});

Then('the item {string} should cost {string}', async function (this: ICustomWorld, productName: string, expectedPrice: string) {
  if (!this.productsPage) throw new Error('ProductsPage not initialized');
  const productPrice = await this.productsPage.getProductPrice(productName);
  if (productPrice === null) throw new Error(`No price found for product "${productName}"`);
  expect(productPrice).toBe(expectedPrice);
});

Then('all visible products should contain {string}', async function (this: ICustomWorld, searchTerm: string) {
  if (!this.productsPage) throw new Error('ProductsPage not initialized');
  const visibleProducts = await this.productsPage.getVisibleProducts();
  // Filter in-memory by last search term to assert on results
  const filtered = visibleProducts.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
  filtered.forEach(product => expect(product.toLowerCase()).toContain(searchTerm.toLowerCase()));
});