# SauceDemo E2E Testing Framework

This project is an end-to-end testing framework for [SauceDemo](https://www.saucedemo.com) using Playwright, TypeScript, and Cucumber BDD.

## Features

- BDD-style tests using Cucumber
- Page Object Model implementation
- TypeScript for type safety
- Cross-browser testing (Chromium and WebKit)
- Parallel test execution
- Automatic screenshot and video capture on failure
- HTML reporting (Playwright and Cucumber)
- GitHub Actions CI integration with email notifications

## Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Chrome and Safari browsers

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd sauce-demo-playwright-e2e
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install --with-deps chromium webkit
```

4. Create environment file:
```bash
cp .env.example .env
```

## Running Tests

To run all tests sequentially:
```bash
npm test
```

To run tests in parallel:
```bash
npm run test:parallel
```

To run tests in CI mode:
```bash
npm run test:ci
```

## Viewing Reports

To open the Playwright HTML report:
```bash
npm run report
```

To open the Cucumber HTML report:
```bash
npm run report:cucumber
```

## Project Structure

```
├── features/           # Gherkin feature files
├── step-definitions/   # Step implementation files
├── pages/             # Page Object Model classes
├── utils/             # Helper functions
├── reports/           # Cucumber reports
├── test-report/       # Playwright HTML report
└── test-results/      # Screenshots and videos
```

## Configuration Files

- `cucumber.js` - Cucumber configuration with profiles for different run modes
- `playwright.config.ts` - Playwright settings including retries and timeouts
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables (copy from .env.example)

## CI/CD Pipeline

Tests are automatically run on GitHub Actions when:
- Pushing to main branch
- Creating a pull request targeting main branch

The pipeline:
1. Sets up Node.js environment
2. Installs dependencies
3. Installs Playwright browsers
4. Creates environment file
5. Runs tests in parallel
6. Uploads test artifacts
7. Sends email report to specified address

Test results, including screenshots and videos of failed tests, are uploaded as artifacts and emailed to stakeholders.

## Environment Variables

Required variables in `.env`:
- `USERNAME` - SauceDemo username
- `PASSWORD` - SauceDemo password

Optional variables:
- `HEADLESS` - Run tests in headless mode (default: true)
- `BROWSER` - Default browser to use (default: chromium)
- `BASE_URL` - Application URL (default: https://www.saucedemo.com)

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the ISC License. 