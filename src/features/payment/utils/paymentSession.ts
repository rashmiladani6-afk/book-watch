export const sanitizePaymentSessionId = (sessionId: string): string => {
  const trimmed = sessionId.trim();
  if (!trimmed) return trimmed;

  let cleaned = trimmed;
  if (cleaned.endsWith("paymentpayment")) {
    cleaned = cleaned.slice(0, -"paymentpayment".length);
  } else if (cleaned.endsWith("payment") && cleaned.startsWith("session_")) {
    const withoutSuffix = cleaned.slice(0, -"payment".length);
    if (withoutSuffix.length > "session_".length) {
      cleaned = withoutSuffix;
    }
  }

  const match = cleaned.match(/^(session_[A-Za-z0-9_-]+)/);
  return match ? match[1] : cleaned;
};

export const resolveCashfreeMode = (gatewayState?: string): "sandbox" | "production" => {
  const state = (gatewayState ?? "test").toLowerCase();
  if (state === "test" || state === "sandbox" || state === "enabled") {
    return "sandbox";
  }
  return "production";
};
