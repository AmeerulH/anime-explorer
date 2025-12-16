import { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import clsx from "clsx";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

const FavoriteButton = ({ isFavorite, onToggle }: FavoriteButtonProps) => {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 250);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold shadow-sm transition whitespace-nowrap",
        isFavorite
          ? "bg-amber-500 text-white hover:bg-amber-600"
          : "bg-slate-900 text-white hover:bg-slate-800"
      )}
    >
      <span
        className={clsx(
          "flex h-5 w-5 items-center justify-center text-lg",
          animating && "animate-[fav-pop_0.35s_ease-out]"
        )}
      >
        {isFavorite ? <IoHeart className="text-white" /> : <IoHeartOutline />}
      </span>
      {isFavorite ? "Remove Favorite" : "Add to Favorites"}
    </button>
  );
};

export default FavoriteButton;
