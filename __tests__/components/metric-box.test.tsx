import { render, screen } from '../utils/test-utils';
import MetricBox from '../../app/components/metric-box';

describe('MetricBox', () => {
  it('renders title and value correctly', () => {
    render(<MetricBox title="Test Metric" value="100%" />);
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <MetricBox 
        title="Test Metric" 
        value="100%" 
        subtitle="Additional info" 
      />
    );
    
    expect(screen.getByText('Additional info')).toBeInTheDocument();
  });

  it('renders trend information when provided', () => {
    render(
      <MetricBox 
        title="Test Metric" 
        value="100%" 
        trend="up"
        trendValue="+5.2%" 
      />
    );
    
    expect(screen.getByText('↗')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
  });

  it('applies success status styles correctly', () => {
    render(<MetricBox title="Test Metric" value="100%" status="success" />);
    
    const container = screen.getByText('Test Metric').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
  });

  it('applies warning status styles correctly', () => {
    render(<MetricBox title="Test Metric" value="100%" status="warning" />);
    
    const container = screen.getByText('Test Metric').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-800');
  });

  it('applies error status styles correctly', () => {
    render(<MetricBox title="Test Metric" value="100%" status="error" />);
    
    const container = screen.getByText('Test Metric').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800');
  });

  it('applies default info status styles when no status provided', () => {
    render(<MetricBox title="Test Metric" value="100%" />);
    
    const container = screen.getByText('Test Metric').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
  });

  it('shows correct trend icons', () => {
    const { rerender } = render(
      <MetricBox title="Test" value="100%" trend="up" trendValue="+5%" />
    );
    expect(screen.getByText('↗')).toBeInTheDocument();

    rerender(
      <MetricBox title="Test" value="100%" trend="down" trendValue="-5%" />
    );
    expect(screen.getByText('↘')).toBeInTheDocument();

    rerender(
      <MetricBox title="Test" value="100%" trend="neutral" trendValue="0%" />
    );
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('does not render trend when trend is provided but trendValue is not', () => {
    render(<MetricBox title="Test Metric" value="100%" trend="up" />);
    
    expect(screen.queryByText('↗')).not.toBeInTheDocument();
  });

  it('does not render trend when trendValue is provided but trend is not', () => {
    render(<MetricBox title="Test Metric" value="100%" trendValue="+5%" />);
    
    expect(screen.queryByText('+5%')).not.toBeInTheDocument();
  });

  it('handles numeric values correctly', () => {
    render(<MetricBox title="Count" value={42} />);
    
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('applies minimum width class', () => {
    render(<MetricBox title="Test Metric" value="100%" />);
    
    const container = screen.getByText('Test Metric').closest('div')?.parentElement;
    expect(container).toHaveClass('min-w-[150px]');
  });
});
