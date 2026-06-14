import {
  resolveCashfreeMode,
  sanitizePaymentSessionId,
} from "@/features/payment/utils/paymentSession";

const CASHFREE_SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: "_self" | "_blank" | "_top" | "_modal";
  returnUrl?: string;
}

interface CashfreeCheckoutResult {
  error?: { message?: string };
  redirect?: boolean;
  paymentDetails?: { paymentMessage?: string };
}

interface CashfreeInstance {
  checkout: (options: CashfreeCheckoutOptions) => Promise<CashfreeCheckoutResult>;
}

declare global {
  interface Window {
    Cashfree?: (config: { mode: "sandbox" | "production" }) => CashfreeInstance;
  }
}

let sdkLoadPromise: Promise<void> | null = null;

const loadCashfreeScript = () => {
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[src="${CASHFREE_SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Cashfree SDK")));
      return;
    }

    const script = document.createElement("script");
    script.src = CASHFREE_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.head.appendChild(script);
  });

  return sdkLoadPromise;
};

export const openCashfreeCheckout = async ({
  paymentSessionId,
  gatewayState,
  returnUrl,
}: {
  paymentSessionId: string;
  gatewayState?: string;
  returnUrl?: string;
}) => {
  await loadCashfreeScript();

  if (!window.Cashfree) {
    throw new Error("Cashfree SDK is not available");
  }

  const cleanedSessionId = sanitizePaymentSessionId(paymentSessionId);
  if (!cleanedSessionId.startsWith("session_")) {
    throw new Error("Invalid payment session. Please go back and create the order again.");
  }

  const mode = resolveCashfreeMode(gatewayState);
  const cashfree = window.Cashfree({ mode });
  const result = await cashfree.checkout({
    paymentSessionId: cleanedSessionId,
    redirectTarget: "_self",
    returnUrl,
  });

  if (result.error?.message) {
    throw new Error(result.error.message);
  }

  return result;
};
