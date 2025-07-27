export default function MetricBox({
  title,
  value,
}: {
  title?: string;
  value?: string;
}) {
  return (
    <div className="p-4 border-2 rounded">
      <div className="flex flex-col items-center p-2">
        <span id="metric-title" className="font-bold underline mb-2">
          {title}
        </span>
        <span id="metric-value" className="text-2xl font-bold">
          {value}
        </span>
      </div>
    </div>
  );
}
