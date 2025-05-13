import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, webkit } from '@playwright/test';
import { env } from '../utils/env';

export class CustomWorld extends World {
  private browser: Browser | undefined;
  private context: BrowserContext | undefined;
  public page: Page | undefined;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    // Launch browser based on configuration
    this.browser = env.BROWSER === 'webkit' 
      ? await webkit.launch({ headless: env.HEADLESS })
      : await chromium.launch({ headless: env.HEADLESS });

    // Create new context and page
    this.context = await this.browser.newContext({
      viewport: null,
      baseURL: env.BASE_URL
    });
    this.page = await this.context.newPage();
  }

  async teardown() {
    // Clean up resources
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

// Set custom world constructor
setWorldConstructor(CustomWorld); 