import { useEffect, useState } from "react";
import { Heart, ThumbsUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEventLike } from "@/features/events/hooks/useEventLike";
import { getAuthUrl } from "@/lib/auth/authRedirect";
import { cn } from "@/lib/utils";

interface EventLikeButtonProps {
  eventId: number;
  isLiked: boolean;
  userToken?: string | null;
  variant?: "hero" | "card";
  className?: string;
}

const EventLikeButton = ({
  eventId,
  isLiked: isLikedProp,
  userToken,
  variant = "card",
  className,
}: EventLikeButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const { toggleLike, isUpdating } = useEventLike(userToken);

  useEffect(() => {
    setIsLiked(isLikedProp);
  }, [isLikedProp]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userToken) {
      toast.info("Sign in to like events");
      navigate(getAuthUrl(`${location.pathname}${location.search}`));
      return;
    }

    try {
      const next = await toggleLike(eventId, isLiked);
      setIsLiked(next);
      toast.success(next ? "Added to liked events" : "Removed from liked events");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not update like status. Please try again.";
      toast.error(message);
    }
  };

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isUpdating}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/15 px-3 py-1.5 text-white transition-colors hover:bg-white/25 disabled:opacity-60",
          className,
        )}
        aria-pressed={isLiked}
        aria-label={isLiked ? "Unlike event" : "Like event"}
      >
        <ThumbsUp className={cn("h-4 w-4", isLiked ? "fill-blue-400 text-blue-400" : "text-white")} />
        <span>{isLiked ? "Liked" : "Like"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isUpdating}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 shadow-sm transition-colors hover:bg-white disabled:opacity-60",
        isLiked ? "border-red-200 text-red-500" : "border-gray-200 text-gray-500 hover:text-red-500",
        className,
      )}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Unlike event" : "Like event"}
    >
      <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
    </button>
  );
};

export default EventLikeButton;
