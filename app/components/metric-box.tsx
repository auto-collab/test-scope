interface MetricBoxProps {
  title: string;
  value: string | number;
  status?: 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function MetricBox({
  title,
  value,
  status = 'info',
  subtitle,
  trend,
  trendValue
}: MetricBoxProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className={`p-4 border-2 rounded-lg ${getStatusStyles()} min-w-[150px]`}>
      <div className="flex flex-col items-center text-center">
        <span className="text-sm font-medium mb-1 opacity-80">
          {title}
        </span>
        <span className="text-3xl font-bold mb-1">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs opacity-70">
            {subtitle}
          </span>
        )}
        {trend && trendValue && (
          <div className="flex items-center text-xs mt-1">
            <span className="mr-1">{getTrendIcon()}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
