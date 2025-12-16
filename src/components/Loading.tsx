interface LoadingProps {
  label?: string;
  className?: string;
}

const Loading = ({ label = "Loading...", className = "" }: LoadingProps) => {
  return (
    <div
      className={`flex items-center gap-2 text-sm text-slate-600 ${className}`}
    >
      <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-slate-200" />
      <span className="text-slate-50">{label}</span>
    </div>
  );
};

export default Loading;
