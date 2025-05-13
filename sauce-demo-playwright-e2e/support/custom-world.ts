import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, webkit } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

interface CustomWorldOptions extends IWorldOptions {
  pickle: { name: string };
}

export interface ICustomWorld extends World {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  currentPage: LoginPage | ProductsPage | CartPage | CheckoutPage | null;
  init(): Promise<void>;
  teardown(): Promise<void>;
  pickle: { name: string };
}

export class CustomWorld extends World implements ICustomWorld {
  browser: Browser | null = null;
  context: BrowserContext | null = null;
  page: Page | null = null;
  currentPage: LoginPage | ProductsPage | CartPage | CheckoutPage | null = null;
  pickle: { name: string };

  constructor(options: CustomWorldOptions) {
    super(options);
    this.pickle = options.pickle;
  }

  async init(): Promise<void> {
    const browserType = process.env.BROWSER === 'webkit' ? webkit : chromium;
    this.browser = await browserType.launch({
      headless: process.env.HEADLESS === 'true',
      args: ['--start-maximized']
    });

    this.context = await this.browser.newContext({
      viewport: null,
      recordVideo: {
        dir: 'test-results/videos'
      }
    });

    this.page = await this.context.newPage();
  }

  async teardown(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    
    this.page = null;
    this.context = null;
    this.browser = null;
    this.currentPage = null;
  }
}

setWorldConstructor(CustomWorld); 