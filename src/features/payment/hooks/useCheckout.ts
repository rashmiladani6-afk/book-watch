import { useMutation } from "@tanstack/react-query";
import {
  paymentService,
  type CreateOrderRequest,
} from "@/features/payment/services/paymentService";
import { extractGarbaApiMessage } from "@/lib/garba/apiAuth";

interface UseCreateOrderOptions {
  onSuccess?: (message?: string) => void;
  onError?: (message: string) => void;
}

export const useCreateOrder = (
  userToken?: string | null,
  options?: UseCreateOrderOptions,
) => {
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => paymentService.createOrder(data, userToken),
    onSuccess: (result) => {
      if (result.status !== "success" || !result.data?.order_id) {
        options?.onError?.(result.message || "Could not create order. Please try again.");
        return;
      }
      options?.onSuccess?.(result.message);
    },
    onError: (error: unknown) => {
      const message =
        extractGarbaApiMessage(error) || "Could not create order. Please try again.";
      options?.onError?.(message);
    },
  });
};
