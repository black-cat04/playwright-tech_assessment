import { When, Then } from '@cucumber/cucumber';
import { CheckoutPage } from '../pages/CheckoutPage';
import { World } from '@cucumber/cucumber';
import { Page } from '@playwright/test';
import { assertions } from '../utils/assertions';
import { dataProcessing } from '../utils/dataProcessing';

interface CustomWorld extends World {
  page: Page;
  currentPage: any;
}

let checkoutPage: CheckoutPage;

// Initialize for step usage
When('I initialize the checkout page', async function(this: CustomWorld) {
  checkoutPage = new CheckoutPage(this.page);
  this.currentPage = checkoutPage;
});

When('I fill checkout information:', async function(dataTable: any) {
  const formData = dataProcessing.processFormData(dataTable);
  await checkoutPage.fillCheckoutDetails(
    formData['First Name'],
    formData['Last Name'],
    formData['Zip Code']
  );
});

Then('order summary should be visible', async function() {
  const summary = await checkoutPage.getOrderSummary();
  await assertions.expectToBeVisible(!!summary, 'Order summary should be visible');
});

Then('order summary should show item total {string}', async function(expected: string) {
  const summary = await checkoutPage.getOrderSummary();
  await assertions.expectTextToContain(summary.itemTotal, expected, 'Item total should match');
});

Then('order summary should show tax {string}', async function(expected: string) {
  const summary = await checkoutPage.getOrderSummary();
  await assertions.expectTextToContain(summary.tax, expected, 'Tax amount should match');
});

Then('order summary should show total {string}', async function(expected: string) {
  const summary = await checkoutPage.getOrderSummary();
  await assertions.expectTextToContain(summary.total, expected, 'Total amount should match');
});

When('I complete purchase', async function() {
  await checkoutPage.placeOrder();
});

Then('order confirmation should be visible with message:', async function(docString: string) {
  const message = await checkoutPage.getConfirmationMessage();
  await assertions.expectToMatch(message, docString, 'Confirmation message should match exactly');
});

Then('I should be able to return to products', async function() {
  await checkoutPage.backToProducts();
}); 