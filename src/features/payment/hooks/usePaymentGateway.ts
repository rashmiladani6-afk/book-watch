import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/features/payment/services/paymentService";

export const PAYMENT_GATEWAY_QUERY_KEY = ["payment-gateway"] as const;

export const usePaymentGateway = (userToken?: string | null, enabled = true) => {
  return useQuery({
    queryKey: [...PAYMENT_GATEWAY_QUERY_KEY, userToken ?? ""],
    queryFn: () => paymentService.getPaymentGateway(userToken),
    enabled: enabled && !!userToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
