import clsx from "clsx";
import { Link } from "react-router-dom";

type ErrorMessageVariant = "inline" | "illustrated";

interface ErrorMessageProps {
  message: string;
  title?: string;
  variant?: ErrorMessageVariant;
  className?: string;
  showActions?: boolean;
}

const ErrorMessage = ({
  message,
  title,
  variant = "inline",
  className = "",
  showActions = false,
}: ErrorMessageProps) => {
  if (variant === "illustrated") {
    return (
      <div
        className={clsx(
          "flex flex-col items-center gap-3 p-6 text-center",
          className
        )}
      >
        <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full">
          <img
            src="/luffy_disappointed.png"
            alt="Luffy disappointed"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        {title ? (
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        ) : null}
        <p className="text-sm text-slate-600">{message}</p>
        {showActions && (
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              to="/"
              className={clsx(
                "inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition",
                "hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
              )}
            >
              Go Home
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700",
        className
      )}
    >
      {message}
    </div>
  );
};

export default ErrorMessage;
