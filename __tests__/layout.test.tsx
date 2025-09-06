import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from '../app/layout';

// Mock the fonts to avoid issues in testing
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
  }),
}));

// Mock the AzureDevOpsProvider
jest.mock('../app/contexts/azure-devops-context', () => ({
  AzureDevOpsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="azure-devops-provider">{children}</div>
  ),
}));

describe('RootLayout', () => {
  it('renders children within the layout structure', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>;
    
    render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('wraps children with AzureDevOpsProvider', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>;
    
    render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    );

    expect(screen.getByTestId('azure-devops-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders main element wrapper', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>;
    
    render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    );

    // Check that children are rendered
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('handles multiple children correctly', () => {
    render(
      <RootLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </RootLayout>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('handles empty children', () => {
    render(
      <RootLayout>
        {null}
      </RootLayout>
    );

    // Should still render the provider
    expect(screen.getByTestId('azure-devops-provider')).toBeInTheDocument();
  });
});

describe('Layout Metadata', () => {
  it('exports correct metadata', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Test Scope Dashboard');
    expect(metadata.description).toBe('Azure DevOps pipeline test coverage and quality dashboard');
  });

  it('has all required metadata properties', () => {
    expect(typeof metadata.title).toBe('string');
    expect(typeof metadata.description).toBe('string');
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
  });
});
