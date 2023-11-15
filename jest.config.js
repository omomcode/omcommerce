/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    "./node_modules/",
    ".tmp",
    ".cache"
  ],
  "coverageReporters": [
    "json-summary",
    "text",
    "lcov"
  ],
  coverageDirectory: 'coverage',
};
