import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // ✅ Define separate environments for frontend & backend tests
  projects: [
    {
      displayName: 'backend',
      testMatch: ['**/app/api/**/*.test.ts'], // ✅ Only runs tests in `app/api/`
      testEnvironment: 'node',
    },
    {
      displayName: 'frontend',
      testMatch: ['**/app/**/*.test.tsx'], // ✅ Only runs tests in `app/` (except API)
      testEnvironment: 'jest-environment-jsdom',
    },
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
  coverageReporters: ['lcov', 'text-summary'],
};

// ✅ Export as an ES module
export default createJestConfig(customJestConfig);
