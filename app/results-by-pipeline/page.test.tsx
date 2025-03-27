import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultsByPipelinePage from './page';

describe('ResultsByPipelinePage', () => {
  test('renders the page heading', () => {
    render(<ResultsByPipelinePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Test Results By Pipeline',
    );
  });
});
