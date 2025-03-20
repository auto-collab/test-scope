import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  preset: 'ts-jest', // ✅ Ensures Jest correctly processes TypeScript

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // ✅ Ensures TypeScript is parsed properly
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },

  projects: [
    {
      displayName: 'backend',
      testMatch: ['**/app/api/**/*.test.ts'], // ✅ Runs only backend tests
      testEnvironment: 'node',
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // ✅ Ensures Jest correctly processes TypeScript for backend tests
      },
    },
    {
      displayName: 'frontend',
      testMatch: ['**/app/**/*.test.tsx'], // ✅ Runs only frontend tests
      testEnvironment: 'jest-environment-jsdom',
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // ✅ Ensures Jest correctly processes TypeScript for frontend tests
      },
    },
  ],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageReporters: ['lcov', 'text-summary'],
};

// ✅ Export as an ES module
export default createJestConfig(customJestConfig);
