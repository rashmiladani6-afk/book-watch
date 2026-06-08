import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/features/events/services/cartService";
import { CART_QUERY_KEY } from "@/features/events/hooks/useCart";

interface UseAddToCartOptions {
  onAdded?: () => void;
  onError?: (message: string) => void;
}

export const useAddToCart = (
  userToken?: string | null,
  options?: UseAddToCartOptions,
) => {
  const queryClient = useQueryClient();
  const [replaceEventId, setReplaceEventId] = useState<number | string | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      eventId,
      force,
    }: {
      eventId: number | string;
      force?: boolean;
    }) => cartService.addToCart(eventId, userToken, force ? "force" : undefined),
    onSuccess: async (result, variables) => {
      if (result.status !== "success") {
        options?.onError?.(result.message || "Could not add to cart. Please try again.");
        return;
      }

      if (result.popup && !variables.force) {
        setReplaceEventId(variables.eventId);
        return;
      }

      setReplaceEventId(null);
      await queryClient.refetchQueries({ queryKey: CART_QUERY_KEY });
      options?.onAdded?.();
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not add to cart. Please try again.";
      options?.onError?.(message);
    },
  });

  const addToCart = (eventId: number | string) => {
    mutation.mutate({ eventId });
  };

  const confirmReplace = () => {
    if (replaceEventId == null) return;
    mutation.mutate({ eventId: replaceEventId, force: true });
  };

  const cancelReplace = () => setReplaceEventId(null);

  return {
    addToCart,
    confirmReplace,
    cancelReplace,
    replaceEventId,
    isAdding: mutation.isPending,
    error: mutation.error,
    lastResult: mutation.data,
  };
};
