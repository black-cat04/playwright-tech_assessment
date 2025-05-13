import { BeforeAll, AfterAll, Before, After, Status } from '@cucumber/cucumber';
import { ICustomWorld } from './custom-world';

BeforeAll(async function () {
  // Add any setup that should happen once before all tests
  console.log('Starting test execution...');
});

Before(async function (this: ICustomWorld) {
  // Initialize the world for each scenario
  await this.init();

  // Ensure that 'this.pickle' exists before accessing 'name'
  if (this.pickle && this.pickle.name) {
    console.log(`Starting Scenario: ${this.pickle.name}`);
  } else {
    console.log('Scenario name is undefined');
  }
});

After(async function (this: ICustomWorld, scenario) {
  // Take screenshot if scenario failed
  if (scenario.result?.status === Status.FAILED) {
    const scenarioName = scenario.pickle?.name || 'Unnamed Scenario'; // Safe fallback for undefined scenario name
    const screenshot = await this.page?.screenshot({
      path: `test-results/screenshots/${scenarioName.replace(/\s+/g, '-')}.png`,
      fullPage: true
    });
    if (screenshot) {
      await this.attach(screenshot, 'image/png');
    }
  }
  
  // Cleanup after each scenario
  await this.teardown();

  // Ensure that 'scenario.pickle' exists before accessing 'name'
  if (scenario.pickle && scenario.pickle.name) {
    console.log(`Completed Scenario: ${scenario.pickle.name}`);
  } else {
    console.log('Scenario name is undefined');
  }
});

AfterAll(async function () {
  // Add any cleanup that should happen after all tests
  console.log('Test execution completed.');
});