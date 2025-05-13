const common = {
  requireModule: ['ts-node/register'],
  require: [
    'step-definitions/**/*.ts',
    'support/**/*.ts'
  ],
  format: [
    'progress-bar',
    ['html', 'reports/cucumber-report.html'],
    ['json', 'reports/cucumber-report.json']
  ],
  formatOptions: { snippetInterface: 'async-await' },
  publishQuiet: true,
  parallel: 2,
  timeout: 30000 // 30 seconds timeout for steps
};

module.exports = {
  default: {
    ...common,
    parallel: 0
  },
  parallel: {
    ...common,
    parallel: 2
  },
  ci: {
    ...common,
    parallel: 4,
    format: [
      ['html', 'reports/cucumber-report.html'],
      ['json', 'reports/cucumber-report.json']
    ],
    retry: 1
  }
}; 