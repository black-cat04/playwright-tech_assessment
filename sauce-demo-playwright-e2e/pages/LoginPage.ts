import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class LoginPage extends BasePage {
  // Selectors matching www.saucedemo.com
  private selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    productsTitle: '.title'
  };

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.selectors.usernameInput, username);
    await this.fill(this.selectors.passwordInput, password);
    await this.click(this.selectors.loginButton);
  }

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.selectors.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.selectors.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.click(this.selectors.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.selectors.errorMessage);
    return await this.getText(this.selectors.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.errorMessage);
  }

  async getProductsTitle(): Promise<string> {
    await this.waitForElement(this.selectors.productsTitle);
    return await this.getText(this.selectors.productsTitle);
  }

  async isProductsTitleVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.productsTitle);
  }
} 