import { render, screen } from '../utils/test-utils';
import TestScopeDashboard from '../../app/components/test-scope-dashboard';
import { mockApplications } from '../utils/mock-data';

describe('TestScopeDashboard', () => {
  it('renders dashboard with application data', () => {
    render(<TestScopeDashboard application={mockApplications[0]} />);
    
    expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('Pipeline Health')).toBeInTheDocument();
    expect(screen.getByText('Test Pass Rate')).toBeInTheDocument();
    expect(screen.getByText('Code Coverage')).toBeInTheDocument();
  });

  it('displays pipeline information', () => {
    render(<TestScopeDashboard application={mockApplications[0]} />);
    
    expect(screen.getByText('Pipeline Details')).toBeInTheDocument();
    expect(screen.getByText('CI/CD Pipeline')).toBeInTheDocument();
  });

  it('shows application description', () => {
    render(<TestScopeDashboard application={mockApplications[0]} />);
    
    expect(screen.getByText('Main e-commerce application with payment processing')).toBeInTheDocument();
  });
});