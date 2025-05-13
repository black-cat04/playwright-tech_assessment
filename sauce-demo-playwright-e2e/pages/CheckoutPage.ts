import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private selectors = {
    // Form fields
    firstNameInput: '[data-test="firstName"]',
    lastNameInput: '[data-test="lastName"]',
    postalCodeInput: '[data-test="postalCode"]',
    
    // Buttons
    continueButton: '[data-test="continue"]',
    finishButton: '[data-test="finish"]',
    cancelButton: '[data-test="cancel"]',
    
    // Order summary elements
    summaryInfo: '.summary_info',
    itemTotal: '.summary_subtotal_label',
    tax: '.summary_tax_label',
    total: '.summary_total_label',
    
    // Confirmation elements
    confirmationContainer: '#checkout_complete_container',
    thankYouHeader: '.complete-header',
    confirmationText: '.complete-text',
    backHomeButton: '[data-test="back-to-products"]'
  };

  async fillCheckoutDetails(firstName: string, lastName: string, zip: string): Promise<void> {
    await this.waitForElement(this.selectors.firstNameInput);
    await this.fill(this.selectors.firstNameInput, firstName);
    await this.fill(this.selectors.lastNameInput, lastName);
    await this.fill(this.selectors.postalCodeInput, zip);
    await this.click(this.selectors.continueButton);
    
    // Wait for navigation to order summary page
    await this.waitForElement(this.selectors.summaryInfo);
  }

  async placeOrder(): Promise<void> {
    await this.waitForElement(this.selectors.finishButton);
    await this.click(this.selectors.finishButton);
    
    // Wait for confirmation page
    await this.waitForElement(this.selectors.confirmationContainer);
  }

  async getConfirmationMessage(): Promise<string> {
    await this.waitForElement(this.selectors.thankYouHeader);
    const header = await this.getText(this.selectors.thankYouHeader);
    const text = await this.getText(this.selectors.confirmationText);
    return `${header}\n${text}`;
  }

  async getOrderSummary(): Promise<{
    itemTotal: string;
    tax: string;
    total: string;
  }> {
    await this.waitForElement(this.selectors.summaryInfo);
    return {
      itemTotal: await this.getText(this.selectors.itemTotal),
      tax: await this.getText(this.selectors.tax),
      total: await this.getText(this.selectors.total)
    };
  }

  async isOrderConfirmed(): Promise<boolean> {
    await this.waitForElement(this.selectors.confirmationContainer);
    const header = await this.getText(this.selectors.thankYouHeader);
    return header.includes('THANK YOU FOR YOUR ORDER');
  }

  async backToProducts(): Promise<void> {
    await this.click(this.selectors.backHomeButton);
    // Wait for navigation back to products page
    await this.page.waitForURL(/.*inventory.html/);
  }

  async cancel(): Promise<void> {
    await this.click(this.selectors.cancelButton);
    // Wait for navigation back to cart
    await this.page.waitForURL(/.*cart.html/);
  }
} 