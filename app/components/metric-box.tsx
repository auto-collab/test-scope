export default function MetricBox({
  title,
  value,
}: {
  title?: string;
  value?: string;
}) {
  return (
    <div className="p-4 border-1 rounded bg-red-300">
      <div className="flex flex-col items-center p-2 text-red-800">
        <span id="metric-title" className="font-bold mb-2">
          {title}
        </span>
        <span id="metric-value" className="text-2xl font-bold">
          {value}
        </span>
      </div>
    </div>
  );
}
