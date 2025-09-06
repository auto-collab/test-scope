import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import AzureDevOpsSetupGuide from '../../app/components/azure-devops-setup-guide';

describe('AzureDevOpsSetupGuide', () => {
  it('renders the setup guide header', () => {
    render(<AzureDevOpsSetupGuide />);
    
    expect(screen.getByText('🔧 Azure DevOps Integration Setup')).toBeInTheDocument();
    expect(screen.getByText(/Currently running in/)).toBeInTheDocument();
    expect(screen.getByText(/demo mode/)).toBeInTheDocument();
    expect(screen.getByText('Demo Mode')).toBeInTheDocument();
  });

  it('shows toggle button to show integration guide', () => {
    render(<AzureDevOpsSetupGuide />);
    
    expect(screen.getByText('Show Integration Guide')).toBeInTheDocument();
  });

  it('initially hides the detailed guide content', () => {
    render(<AzureDevOpsSetupGuide />);
    
    expect(screen.queryByText('Step 1: Create Personal Access Token')).not.toBeInTheDocument();
    expect(screen.queryByText('Step 2: Enable Real Integration')).not.toBeInTheDocument();
  });

  it('shows detailed guide when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<AzureDevOpsSetupGuide />);
    
    const toggleButton = screen.getByText('Show Integration Guide');
    await user.click(toggleButton);
    
    // All steps should now be visible
    expect(screen.getByText('Step 1: Create Personal Access Token')).toBeInTheDocument();
    expect(screen.getByText('Step 2: Enable Real Integration')).toBeInTheDocument();
    expect(screen.getByText('Step 3: Configure Your Organization')).toBeInTheDocument();
    expect(screen.getByText('Step 4: Test the Integration')).toBeInTheDocument();
    expect(screen.getByText('Azure DevOps REST API Endpoints Used')).toBeInTheDocument();
  });

  it('changes toggle button text when guide is shown', async () => {
    const user = userEvent.setup();
    render(<AzureDevOpsSetupGuide />);
    
    const toggleButton = screen.getByText('Show Integration Guide');
    await user.click(toggleButton);
    
    expect(screen.getByText('Hide Integration Guide')).toBeInTheDocument();
    expect(screen.queryByText('Show Integration Guide')).not.toBeInTheDocument();
  });

  it('hides detailed guide when toggle button is clicked again', async () => {
    const user = userEvent.setup();
    render(<AzureDevOpsSetupGuide />);
    
    const toggleButton = screen.getByText('Show Integration Guide');
    
    // Show guide
    await user.click(toggleButton);
    expect(screen.getByText('Step 1: Create Personal Access Token')).toBeInTheDocument();
    
    // Hide guide
    const hideButton = screen.getByText('Hide Integration Guide');
    await user.click(hideButton);
    
    expect(screen.queryByText('Step 1: Create Personal Access Token')).not.toBeInTheDocument();
    expect(screen.getByText('Show Integration Guide')).toBeInTheDocument();
  });

  it('displays Personal Access Token creation steps', async () => {
    const user = userEvent.setup();
    render(<AzureDevOpsSetupGuide />);
    
    await user.click(screen.getByText('Show Integration Guide'));
    
    // Check step 1 content
    expect(screen.getByText('Go to your Azure DevOps organization')).toBeInTheDocument();
    expect(screen.getByText(/Click on your profile picture/)).toBeInTheDocument();
    expect(screen.getByText('Set name: "Test Scope Dashboard"')).toBeInTheDocument();
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('Test Management')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Project and Team')).toBeInTheDocument();
  });

  it('displays API route update instructions', async () => {
    const user = userEvent.setup();
    render(<AzureDevOpsSetupGuide />);
    
    await user.click(screen.getByText('Show Integration Guide'));
    
    // Check step 2 content
    expect(screen.getByText(/Replace the mock data in/)).toBeInTheDocument();
    expect(screen.getByText('app/api/azure-devops/route.ts')).toBeInTheDocument();
    expect(screen.getByText('real-integration-example.ts')).toBeInTheDocument();
    expect(screen.getByText(/Copy this code into your route.ts:/)).toBeInTheDocument();
  });

  it('displays configuration instructions', async () => {
    const user = userEvent.setup();
    render(<AzureDevOpsSetupGuide />);
    
    await user.click(screen.getByText('Show Integration Guide'));
    
    // Check step 3 content
    expect(screen.getByText(/Update the context to use your real Azure DevOps/)).toBeInTheDocument();
    expect(screen.getByText(/organization:/)).toBeInTheDocument();
    expect(screen.getByText(/project:/)).toBeInTheDocument();
    expect(screen.getByText(/personalAccessToken:/)).toBeInTheDocument();
  });

  it('displays testing instructions', async () => {
    const user = userEvent.setup();
    render(<AzureDevOpsSetupGuide />);
    
    await user.click(screen.getByText('Show Integration Guide'));
    
    // Check step 4 content
    expect(screen.getByText('Restart your development server')).toBeInTheDocument();
    expect(screen.getByText('Open the browser console to see any API errors')).toBeInTheDocument();
    expect(screen.getByText('Check that real project names appear in the dropdown')).toBeInTheDocument();
    expect(screen.getByText('Verify that pipeline data loads from your Azure DevOps')).toBeInTheDocument();
  });

  it('displays API endpoints reference', async () => {
    const user = userEvent.setup();
    render(<AzureDevOpsSetupGuide />);
    
    await user.click(screen.getByText('Show Integration Guide'));
    
    // Check API endpoints section
    expect(screen.getByText('Projects:')).toBeInTheDocument();
    expect(screen.getByText('/_apis/projects')).toBeInTheDocument();
    expect(screen.getByText('Build Definitions:')).toBeInTheDocument();
    expect(screen.getByText('/{project}/_apis/build/definitions')).toBeInTheDocument();
    expect(screen.getByText('Builds:')).toBeInTheDocument();
    expect(screen.getByText('/{project}/_apis/build/builds')).toBeInTheDocument();
    expect(screen.getByText('Test Runs:')).toBeInTheDocument();
    expect(screen.getByText('/{project}/_apis/test/runs')).toBeInTheDocument();
    expect(screen.getByText('Code Coverage:')).toBeInTheDocument();
    expect(screen.getByText('/{project}/_apis/build/builds/{buildId}/coverage')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<AzureDevOpsSetupGuide />);
    
    // Check main container styling - need to go up to the right parent
    const mainContainer = screen.getByText('🔧 Azure DevOps Integration Setup').closest('div')?.parentElement?.parentElement;
    expect(mainContainer).toHaveClass('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'p-6', 'mb-8');
    
    // Check demo mode badge styling
    const demoBadge = screen.getByText('Demo Mode');
    expect(demoBadge).toHaveClass('bg-blue-100', 'text-blue-800', 'px-3', 'py-1', 'rounded-full', 'text-sm', 'font-medium');
  });

  it('has proper accessibility attributes for interactive elements', async () => {
    const user = userEvent.setup();
    render(<AzureDevOpsSetupGuide />);
    
    const toggleButton = screen.getByText('Show Integration Guide');
    expect(toggleButton.tagName).toBe('BUTTON');
    
    // Button should be focusable and clickable
    await user.tab();
    expect(toggleButton).toHaveFocus();
  });

  it('displays code examples with proper formatting', async () => {
    const user = userEvent.setup();
    render(<AzureDevOpsSetupGuide />);
    
    await user.click(screen.getByText('Show Integration Guide'));
    
    // Check that code examples are in <pre> tags for proper formatting
    const codeBlocks = screen.getAllByText(/const|getProjects|organization:/);
    expect(codeBlocks.length).toBeGreaterThan(0);
    
    // Check for inline code formatting
    const inlineCodeElements = screen.getAllByText('app/api/azure-devops/route.ts')[0];
    expect(inlineCodeElements.tagName).toBe('CODE');
  });
});
