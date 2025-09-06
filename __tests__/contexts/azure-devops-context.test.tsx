import { render } from '../utils/test-utils';
import { useAzureDevOps } from '../../app/contexts/azure-devops-context';

// Simple component to test context usage
function TestComponent() {
  useAzureDevOps();
  return <div>Test</div>;
}

describe('AzureDevOpsContext', () => {
  it('throws error when useAzureDevOps is used outside provider', () => {
    // Suppress console.error for this test since we expect an error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      render(<TestComponent />, { skipProvider: true });
    }).toThrow('useAzureDevOps must be used within an AzureDevOpsProvider');
    
    consoleSpy.mockRestore();
  });
});
