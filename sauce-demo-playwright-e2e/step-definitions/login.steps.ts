import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { World } from '@cucumber/cucumber';
import { Page } from '@playwright/test';

interface CustomWorld extends World {
  page: Page;
}

let loginPage: LoginPage;

Given('I am on the login page', async function(this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

When('I enter username {string} and password {string}', async function(username: string, password: string) {
  await loginPage.enterUsername(username);
  await loginPage.enterPassword(password);
});

When('I click the login button', async function() {
  await loginPage.clickLoginButton();
});

Then('I should see a login error message {string}', async function(message: string) {
  const isErrorVisible = await loginPage.isErrorVisible();
  expect(isErrorVisible, 'Error message should be visible').toBeTruthy();
  
  const errorText = await loginPage.getErrorMessage();
  expect(errorText, 'Error message should match expected text').toBe(message);
}); 