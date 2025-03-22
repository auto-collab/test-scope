import { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom', // Works for testing frontend & backend environments

  verbose: true, // Enables detailed test output

  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'], // Enables detailed text output
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.test.{ts,tsx}',
    '!app/pages/**/*',
    '!app/layout.tsx',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!jest.config.ts',
    '!babel.config.js',
  ],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
