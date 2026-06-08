interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${className || "bg-gray-800"}`}>
      <div
        className={`h-full transition-all duration-300 ${
          className ? "bg-green-500" : "bg-white"
        }`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
