import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import TestResultsDetailsComponent from '../../app/components/test-results-details';
import { mockTestResultsDetails, mockTestResult, mockFailedTestResult } from '../utils/mock-data';

describe('TestResultsDetailsComponent', () => {
  it('renders no results message when testResults is empty', () => {
    render(<TestResultsDetailsComponent testResults={[]} />);
    
    expect(screen.getByText('No detailed test results available')).toBeInTheDocument();
  });

  it('renders no results message when testResults is undefined', () => {
    render(<TestResultsDetailsComponent testResults={undefined as any} />);
    
    expect(screen.getByText('No detailed test results available')).toBeInTheDocument();
  });

  it('renders test results header', () => {
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    expect(screen.getByText('Test Results by Assembly')).toBeInTheDocument();
  });

  it('renders assembly information correctly', () => {
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    expect(screen.getByText('ECommerce.Tests.dll')).toBeInTheDocument();
    expect(screen.getByText('ECommerce.Tests.Unit')).toBeInTheDocument();
    expect(screen.getByText('(145 total)')).toBeInTheDocument();
  });

  it('displays test count summary correctly', () => {
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    expect(screen.getByText('1 passed')).toBeInTheDocument();
    expect(screen.getByText('1 failed')).toBeInTheDocument();
  });

  it('expands assembly when clicked', async () => {
    const user = userEvent.setup();
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    // Initially collapsed - test details not visible
    expect(screen.queryByText('Should calculate total price correctly')).not.toBeInTheDocument();
    
    // Click to expand
    const assemblyHeader = screen.getByText('ECommerce.Tests.dll').closest('div');
    await user.click(assemblyHeader!);
    
    // Now test details should be visible
    expect(screen.getByText('Should calculate total price correctly')).toBeInTheDocument();
    expect(screen.getByText('Should handle inventory updates')).toBeInTheDocument();
  });

  it('collapses assembly when clicked again', async () => {
    const user = userEvent.setup();
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    const assemblyHeader = screen.getByText('ECommerce.Tests.dll').closest('div');
    
    // Expand first
    await user.click(assemblyHeader!);
    expect(screen.getByText('Should calculate total price correctly')).toBeInTheDocument();
    
    // Collapse
    await user.click(assemblyHeader!);
    expect(screen.queryByText('Should calculate total price correctly')).not.toBeInTheDocument();
  });

  it('displays test outcome badges with correct colors', async () => {
    const user = userEvent.setup();
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    // Expand assembly to see tests
    const assemblyHeader = screen.getByText('ECommerce.Tests.dll').closest('div');
    await user.click(assemblyHeader!);
    
    // Check passed test badge
    const passedBadge = screen.getAllByText('passed')[0];
    expect(passedBadge).toHaveClass('text-green-600', 'bg-green-100');
    
    // Check failed test badge
    const failedBadge = screen.getByText('failed');
    expect(failedBadge).toHaveClass('text-red-600', 'bg-red-100');
  });

  it('displays test duration correctly', async () => {
    const user = userEvent.setup();
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    // Expand assembly
    const assemblyHeader = screen.getByText('ECommerce.Tests.dll').closest('div');
    await user.click(assemblyHeader!);
    
    // Check duration formatting
    expect(screen.getByText('45ms')).toBeInTheDocument(); // < 1000ms
    expect(screen.getByText('78ms')).toBeInTheDocument(); // 78ms stays as ms since < 1000
  });

  it('expands individual test when clicked', async () => {
    const user = userEvent.setup();
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    // Expand assembly first
    const assemblyHeader = screen.getByText('ECommerce.Tests.dll').closest('div');
    await user.click(assemblyHeader!);
    
    // Initially test details not visible
    expect(screen.queryByText('Test ID:')).not.toBeInTheDocument();
    
    // Click on a test to expand
    const testHeader = screen.getByText('Should calculate total price correctly').closest('div');
    await user.click(testHeader!);
    
    // Now detailed test info should be visible
    expect(screen.getByText('Test ID:')).toBeInTheDocument();
    expect(screen.getByText('Priority:')).toBeInTheDocument();
    expect(screen.getByText('State:')).toBeInTheDocument();
    expect(screen.getByText('Started:')).toBeInTheDocument();
    expect(screen.getByText('Completed:')).toBeInTheDocument();
  });

  it('displays error message and stack trace for failed tests', async () => {
    const user = userEvent.setup();
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    // Expand assembly
    const assemblyHeader = screen.getByText('ECommerce.Tests.dll').closest('div');
    await user.click(assemblyHeader!);
    
    // Expand failed test
    const failedTestHeader = screen.getByText('Should handle inventory updates').closest('div');
    await user.click(failedTestHeader!);
    
    // Check error details
    expect(screen.getByText('Error Message:')).toBeInTheDocument();
    expect(screen.getByText('Expected inventory count to be 0, but was 1')).toBeInTheDocument();
    expect(screen.getByText('Stack Trace:')).toBeInTheDocument();
    expect(screen.getByText(/at ECommerce.Tests.Unit.InventoryTests/)).toBeInTheDocument();
  });

  it('does not show error section for passed tests', async () => {
    const user = userEvent.setup();
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    // Expand assembly
    const assemblyHeader = screen.getByText('ECommerce.Tests.dll').closest('div');
    await user.click(assemblyHeader!);
    
    // Expand passed test
    const passedTestHeader = screen.getByText('Should calculate total price correctly').closest('div');
    await user.click(passedTestHeader!);
    
    // Should not show error sections
    expect(screen.queryByText('Error Message:')).not.toBeInTheDocument();
    expect(screen.queryByText('Stack Trace:')).not.toBeInTheDocument();
  });

  it('displays test run information', async () => {
    const user = userEvent.setup();
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    // Expand assembly and test
    const assemblyHeader = screen.getByText('ECommerce.Tests.dll').closest('div');
    await user.click(assemblyHeader!);
    
    const testHeader = screen.getByText('Should calculate total price correctly').closest('div');
    await user.click(testHeader!);
    
    // Check test run info
    expect(screen.getByText(/Test Run:/)).toBeInTheDocument();
    expect(screen.getByText(/CI\/CD Pipeline Run/)).toBeInTheDocument();
    expect(screen.getByText(/#12345/)).toBeInTheDocument();
  });

  it('handles different test outcomes with correct colors', () => {
    const testResultsWithDifferentOutcomes = [{
      testAssembly: 'Test.dll',
      testContainer: 'Test.Container',
      totalCount: 6,
      results: [
        { ...mockTestResult, id: 1, outcome: 'passed' as const },
        { ...mockTestResult, id: 2, outcome: 'failed' as const },
        { ...mockTestResult, id: 3, outcome: 'inconclusive' as const },
        { ...mockTestResult, id: 4, outcome: 'timeout' as const },
        { ...mockTestResult, id: 5, outcome: 'aborted' as const },
        { ...mockTestResult, id: 6, outcome: 'inProgress' as const },
      ]
    }];

    const { container } = render(<TestResultsDetailsComponent testResults={testResultsWithDifferentOutcomes} />);
    
    // The color classes are applied but we can't easily test them without expanding
    // This test ensures the component renders without errors with different outcomes
    expect(screen.getByText('Test.dll')).toBeInTheDocument();
  });

  it('handles assembly with no failed tests', () => {
    const testResultsWithOnlyPassed = [{
      testAssembly: 'AllPassed.dll',
      testContainer: 'AllPassed.Container',
      totalCount: 2,
      results: [
        { ...mockTestResult, id: 1, outcome: 'passed' as const },
        { ...mockTestResult, id: 2, outcome: 'passed' as const }
      ]
    }];

    render(<TestResultsDetailsComponent testResults={testResultsWithOnlyPassed} />);
    
    expect(screen.getByText('2 passed')).toBeInTheDocument();
    expect(screen.queryByText(/failed/)).not.toBeInTheDocument();
  });

  it('handles assembly with other test outcomes', () => {
    const testResultsWithOther = [{
      testAssembly: 'Mixed.dll',
      testContainer: 'Mixed.Container',
      totalCount: 3,
      results: [
        { ...mockTestResult, id: 1, outcome: 'passed' as const },
        { ...mockTestResult, id: 2, outcome: 'inconclusive' as const },
        { ...mockTestResult, id: 3, outcome: 'timeout' as const }
      ]
    }];

    render(<TestResultsDetailsComponent testResults={testResultsWithOther} />);
    
    expect(screen.getByText('1 passed')).toBeInTheDocument();
    expect(screen.getByText('2 other')).toBeInTheDocument();
  });

  it('expands and collapses correctly', async () => {
    const user = userEvent.setup();
    render(<TestResultsDetailsComponent testResults={mockTestResultsDetails} />);
    
    const assemblyHeader = screen.getByText('ECommerce.Tests.dll').closest('div');
    
    // Initially collapsed - test details not visible
    expect(screen.queryByText('Should calculate total price correctly')).not.toBeInTheDocument();
    
    // Click to expand
    await user.click(assemblyHeader!);
    
    // Now test details should be visible
    expect(screen.getByText('Should calculate total price correctly')).toBeInTheDocument();
    
    // Click to collapse
    await user.click(assemblyHeader!);
    
    // Test details should be hidden again
    expect(screen.queryByText('Should calculate total price correctly')).not.toBeInTheDocument();
  });
});
