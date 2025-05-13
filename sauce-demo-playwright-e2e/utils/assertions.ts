import { expect } from '@playwright/test';

export const assertions = {
  async expectCount(actual: number, expected: number, message: string): Promise<void> {
    expect(actual, `Expected ${expected} ${message}, but found ${actual}`).toBe(expected);
  },

  async expectToContain(list: string[], item: string, message: string): Promise<void> {
    expect(list, `${message} "${item}"`).toContain(item);
  },

  async expectTextToContain(text: string, substring: string, message: string): Promise<void> {
    expect(text, message).toContain(substring);
  },

  async expectToMatch(actual: string, expected: string, message: string): Promise<void> {
    expect(actual.trim(), message).toBe(expected.trim());
  },

  async expectToBeVisible(isVisible: boolean, message: string): Promise<void> {
    expect(isVisible, message).toBeTruthy();
  },

  async expectPriceToMatch(actual: string | null, expected: string, itemName: string): Promise<void> {
    expect(actual, `Price for "${itemName}" should be ${expected}`).toBe(expected);
  },

  async expectUrlToContain(url: string, expected: string, message: string): Promise<void> {
    expect(url, message).toContain(expected);
  }
}; 