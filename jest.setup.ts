import '@testing-library/jest-dom'; // Enables useful matchers (e.g., `toBeInTheDocument()`)
const originalConsoleError = console.error; // ✅ Save the original console.error

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
    const IGNORED_ERRORS = [
      'Expected error message',
      'Another known error to ignore',
    ];

    // Suppress only specific errors
    if (!IGNORED_ERRORS.some((ignored) => message.includes(ignored))) {
      //   originalConsoleError(message, ...args); // ✅ Call the real console.error for unexpected errors
    }
  });
});

afterAll(() => {
  jest.restoreAllMocks(); // ✅ Restore console.error after tests finish
});
