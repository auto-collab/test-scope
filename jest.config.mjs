import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  preset: 'ts-jest',

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json', // Ensures Jest uses TypeScript's JSX settings
      },
    ],
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },

  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.test.{ts,tsx}',
    '!app/api/**/*.test.ts',
    '!app/pages/**/*',
    '!app/layout.tsx',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },

  projects: [
    {
      displayName: 'backend',
      testMatch: ['**/app/api/**/*.test.ts'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
    },
    {
      displayName: 'frontend',
      testMatch: ['**/app/**/*.test.tsx'],
      testEnvironment: 'jest-environment-jsdom',
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/tsconfig.json', // Ensures Jest correctly compiles JSX
          },
        ],
      },
    },
  ],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

// Export as an ES module
export default createJestConfig(customJestConfig);
