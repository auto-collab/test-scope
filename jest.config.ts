import { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom', // ✅ Single environment (Supports both frontend & backend)

  transform: {
    '^.+\\.tsx?$': 'babel-jest', // ✅ Uses Babel instead of ts-jest
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary'],
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

  verbose: true, // ✅ Enables detailed test output
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // ✅ Runs before tests
};

export default config;
