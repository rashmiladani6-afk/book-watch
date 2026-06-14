import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  paymentService,
  type VerifyPaymentRequest,
} from "@/features/payment/services/paymentService";
import { CART_QUERY_KEY } from "@/features/events/hooks/useCart";
import { extractGarbaApiMessage } from "@/lib/garba/apiAuth";

interface UseVerifyPaymentOptions {
  onSuccess?: (message?: string) => void;
  onError?: (message: string) => void;
}

export const useVerifyPayment = (
  userToken?: string | null,
  options?: UseVerifyPaymentOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyPaymentRequest) =>
      paymentService.verifyPayment(data, userToken),
    onSuccess: async (result) => {
      if (result.status !== "success") {
        options?.onError?.(result.message || "Payment verification failed");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      options?.onSuccess?.(result.message);
    },
    onError: (error: unknown) => {
      const message =
        extractGarbaApiMessage(error) || "Payment verification failed";
      options?.onError?.(message);
    },
  });
};
