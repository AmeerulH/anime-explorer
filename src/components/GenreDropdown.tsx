import useAnimeGenres from "../hooks/useAnimeGenres";
import { IoChevronDown } from "react-icons/io5";

interface GenreDropdownProps {
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

const GenreDropdown = ({ selectedId, onSelect }: GenreDropdownProps) => {
  const { genres, isLoading, error } = useAnimeGenres();

  return (
    <div className="relative w-full sm:w-56">
      <select
        className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-10 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        value={selectedId ?? ""}
        onChange={(e) =>
          onSelect(e.target.value === "" ? null : Number(e.target.value))
        }
        disabled={isLoading}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.mal_id} value={genre.mal_id}>
            {genre.name}
          </option>
        ))}
      </select>
      <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
      {error && (
        <p className="mt-1 text-xs text-red-600">
          Failed to load genres: {error}
        </p>
      )}
    </div>
  );
};

export default GenreDropdown;
