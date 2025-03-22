module.exports = {
  presets: [
    ['next/babel'], // ✅ Next.js preset
    ['@babel/preset-env', { targets: { node: 'current' } }], // ✅ Ensures modern JS support
    '@babel/preset-typescript', // ✅ Enables TypeScript support
  ],
};
