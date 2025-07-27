export default function MetricBox({
  title,
  value,
}: {
  title?: string;
  value?: string;
}) {
  return (
    <div className="p-8 rounded border-2">
      <div className="flex flex-col items-center">
        <span id="metric-title" className="font-bold">
          {title}
        </span>
        <span id="metric-value" className="text-2xl font-bold">
          {value}
        </span>
      </div>
    </div>
  );
}
