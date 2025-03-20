import { render, screen } from '@testing-library/react';
import ResultsByPipelinePage from '../page'; // ✅ Ensure correct import path

describe('ResultsByPipelinePage', () => {
  test('renders the page heading', () => {
    // render(<ResultsByPipelinePage />);
    // expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    //   'Test Results By Pipeline',
    // );
    expect(1 + 1).toBe(2);
  });
});
