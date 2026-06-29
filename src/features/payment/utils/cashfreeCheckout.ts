import {
  getCashfreeModesToTry,
  isCashfreeSessionInvalidError,
  isValidPaymentSessionId,
  resolveCashfreeMode,
} from "@/features/payment/utils/paymentSession";

const CASHFREE_SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: "_self" | "_blank" | "_top" | "_modal";
  returnUrl?: string;
}

interface CashfreeCheckoutResult {
  error?: { message?: string; code?: string; type?: string };
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
  const sessionId = typeof paymentSessionId === "string" ? paymentSessionId.trim() : "";

  if (!sessionId || !isValidPaymentSessionId(sessionId)) {
    throw new Error("Payment session is missing. Tap Start over and try checkout again.");
  }

  await loadCashfreeScript();

  if (!window.Cashfree) {
    throw new Error("Cashfree SDK is not available");
  }

  const modesToTry = getCashfreeModesToTry(gatewayState);
  console.log("[Cashfree] session_id:", sessionId);
  console.log("[Cashfree] gatewayState:", gatewayState, "→ modes to try:", modesToTry);
  let lastError: Error | null = null;

  for (const mode of modesToTry) {
    console.log("[Cashfree] trying mode:", mode);
    const cashfree = window.Cashfree({ mode });
    const result = await cashfree.checkout({
      paymentSessionId: sessionId,
      redirectTarget: "_self",
      returnUrl,
    });

    console.log("[Cashfree] result for mode", mode, ":", result);

    if (!result.error?.message) {
      return { ...result, mode, paymentSessionId: sessionId };
    }

    const message = result.error.message;
    if (!isCashfreeSessionInvalidError(message, result.error.code)) {
      throw new Error(message);
    }

    lastError = new Error(message);
  }

  const primaryMode = resolveCashfreeMode(gatewayState);
  throw (
    lastError ??
    new Error(
      `Cashfree rejected the payment session in ${primaryMode} mode. ` +
        "Tap Start over, remove the cart, and checkout again.",
    )
  );
};
