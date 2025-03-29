import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom', // Simulates browser-like environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Ensures setup before tests

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Resolves import aliases
  },

  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {}],
  },

  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/jest.setup.ts',
    '!**/*.config.{ts,tsx}',
  ],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coverageDirectory: '<rootDir>/coverage',
};

export default createJestConfig(customJestConfig as any);
