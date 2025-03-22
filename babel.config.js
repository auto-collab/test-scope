module.exports = {
  presets: [
    ['next/babel'],
    ['@babel/preset-env', { targets: { node: 'current' } }], // Ensures modern JS support
    '@babel/preset-typescript', // Enables TypeScript support
  ],
};
