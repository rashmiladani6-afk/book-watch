import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/features/events/services/cartService";

export const CART_QUERY_KEY = ["cart-detail"] as const;

export const useCart = (userToken?: string | null, enabled = true) => {
  return useQuery({
    queryKey: [...CART_QUERY_KEY, userToken ?? ""],
    queryFn: () => cartService.getCartDetail(userToken),
    enabled: enabled && !!userToken,
    retry: false,
    staleTime: 30_000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
