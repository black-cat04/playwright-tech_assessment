import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface Environment {
  CI: boolean;
  BASE_URL: string;
  HEADLESS: boolean;
  BROWSER: 'chromium' | 'webkit';
  DEFAULT_TIMEOUT: number;
  STANDARD_USER: string;
  STANDARD_PASSWORD: string;
  LOCKED_USER: string;
  PROBLEM_USER: string;
  PERFORMANCE_USER: string;
}

export const env: Environment = {
  CI: process.env.CI === 'true',
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com',
  HEADLESS: process.env.HEADLESS === 'true',
  BROWSER: (process.env.BROWSER || 'chromium') as 'chromium' | 'webkit',
  DEFAULT_TIMEOUT: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
  STANDARD_USER: process.env.STANDARD_USER || 'standard_user',
  STANDARD_PASSWORD: process.env.STANDARD_PASSWORD || 'secret_sauce',
  LOCKED_USER: process.env.LOCKED_USER || 'locked_out_user',
  PROBLEM_USER: process.env.PROBLEM_USER || 'problem_user',
  PERFORMANCE_USER: process.env.PERFORMANCE_USER || 'performance_glitch_user'
};

export const getBaseUrl = () => env.BASE_URL; 