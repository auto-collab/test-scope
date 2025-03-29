import { render, screen } from '@testing-library/react';
import ResultsByPipelinePage from './page';
import DashboardLayout from './layout';

describe('ResultsByPipelinePage', () => {
  test('should render page heading', () => {
    render(<ResultsByPipelinePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Test Results By Pipeline',
    );
  });

  test('renders children inside the layout', () => {
    render(
      <DashboardLayout>
        <p data-testid="child-element">Test Child</p>
      </DashboardLayout>,
    );

    expect(screen.getByTestId('child-element')).toHaveTextContent('Test Child');
  });
});
