module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middlewares/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000,
  reporters: [
    'default', // mostra no terminal
    ['jest-json-reporter', {
      outputPath: 'backend/test-results.json', // caminho que o Jenkins vai ler
      includeConsoleOutput: true
    }]
  ]
};
