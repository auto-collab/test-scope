import { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  verbose: true,

  transform: {
    '^.+\\.tsx?$': [
      'babel-jest',
      {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      },
    ],
  },

  extensionsToTreatAsEsm: ['.ts', '.tsx'], // ✅ Fixes `import` issues
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
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
