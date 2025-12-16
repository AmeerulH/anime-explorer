import clsx from "clsx";

interface SearchNotFoundProps {
  query?: string;
}

const SearchNotFound = ({ query = "" }: SearchNotFoundProps) => {
  const displayQuery = query.trim() || "that anime";

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 sm:flex-row sm:justify-center">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="space-y-2 max-w-xl text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Nothing found
          </p>
          <h3 className="text-xl font-bold text-slate-900">
            Could not find “{displayQuery}”. Try a different anime!
          </h3>
          <p className="text-sm text-slate-600">
            Even Naruto couldn’t spot this one. Maybe tweak your search?
          </p>
        </div>
        <div
          className={clsx("relative flex justify-end", "sm:w-56 sm:shrink-0")}
        >
          <div className="relative h-52 w-52 sm:h-64 sm:w-64">
            <img
              src="/naruto_look.png"
              alt="Naruto looking around disappointed"
              className="absolute inset-0 h-full w-full object-contain object-left"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchNotFound;
