// ✅ Only load Jest DOM matchers if running frontend tests
if (typeof window !== 'undefined') {
  import('@testing-library/jest-dom');
}
