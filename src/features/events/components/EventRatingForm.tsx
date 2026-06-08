import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAddRating } from "@/features/events/hooks/useAddRating";
import { cn } from "@/lib/utils";

interface EventRatingFormProps {
  eventId: number;
  currentRating: number;
  userToken?: string | null;
}

const EventRatingForm = ({
  eventId,
  currentRating,
  userToken,
}: EventRatingFormProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const { submitRating, isSubmitting } = useAddRating(eventId, userToken);

  const displayRating = Number.isFinite(currentRating) ? currentRating.toFixed(1) : "0.0";
  const activeValue = hoveredRating || selectedRating;

  const handleRate = async (rating: number) => {
    setSelectedRating(rating);
    try {
      const result = await submitRating(rating);
      if (result.status !== "success") {
        throw new Error(result.message || "Could not submit rating");
      }
      toast.success(`Thanks! You rated this event ${rating}/5`);
    } catch (error: unknown) {
      setSelectedRating(0);
      const message =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Could not submit rating. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Rate this event</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Current average: <span className="font-semibold text-gray-900">{displayRating}/5</span>
          </p>
        </div>

        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            const isActive = value <= activeValue;

            return (
              <button
                key={value}
                type="button"
                disabled={isSubmitting}
                onMouseEnter={() => setHoveredRating(value)}
                onClick={() => handleRate(value)}
                className="rounded p-1 transition-transform hover:scale-110 disabled:opacity-60"
                aria-label={`Rate ${value} out of 5`}
              >
                <Star
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8",
                    isActive ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventRatingForm;
