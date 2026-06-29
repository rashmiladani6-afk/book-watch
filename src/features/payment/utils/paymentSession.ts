const SESSION_PREFIX = "session_";
const MIN_SESSION_LENGTH = SESSION_PREFIX.length + 10;

export const isValidPaymentSessionId = (sessionId?: string | null): boolean => {
  if (!sessionId || typeof sessionId !== "string") return false;
  const trimmed = sessionId.trim();
  return trimmed.startsWith(SESSION_PREFIX) && trimmed.length >= MIN_SESSION_LENGTH;
};

const readDirectSessionField = (payload: unknown): string | undefined => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return undefined;

  const record = payload as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object" && !Array.isArray(record.data)
      ? (record.data as Record<string, unknown>)
      : null;

  const candidates = [
    nested?.payment_session_id,
    nested?.paymentSessionId,
    nested?.session_id,
    nested?.sessionId,
    record.payment_session_id,
    record.paymentSessionId,
    record.session_id,
    record.sessionId,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && isValidPaymentSessionId(candidate)) {
      return candidate.trim();
    }
  }

  return undefined;
};

export const findPaymentSessionInPayload = (payload: unknown): string | undefined =>
  readDirectSessionField(payload);

export const sanitizePaymentSessionId = (sessionId: string): string => sessionId.trim();

export const resolveCashfreeMode = (gatewayState?: string): "sandbox" | "production" => {
  const state = (gatewayState ?? "test").toLowerCase().trim();

  const derivedMode: "sandbox" | "production" =
    state === "production" ||
    state === "live" ||
    state === "prod" ||
    state === "enabled"
      ? "production"
      : "sandbox";

  const envMode = import.meta.env.VITE_CASHFREE_MODE?.trim().toLowerCase();
  if (!envMode) return derivedMode;

  if (envMode === "sandbox" || envMode === "test") return "sandbox";
  if (envMode === "production" || envMode === "live" || envMode === "prod") {
    return "production";
  }

  return derivedMode;
};

export const getCashfreeModesToTry = (gatewayState?: string): Array<"sandbox" | "production"> => {
  const primary = resolveCashfreeMode(gatewayState);
  const alternate: "sandbox" | "production" = primary === "sandbox" ? "production" : "sandbox";
  return primary === alternate ? [primary] : [primary, alternate];
};

export const isCashfreeSessionInvalidError = (message?: string, code?: string): boolean => {
  if (code === "payment_session_id_invalid") return true;

  const text = (message ?? "").toLowerCase();
  return (
    text.includes("payment_session_id_invalid") ||
    text.includes("payment_session_id is not present") ||
    text.includes("payment session id is not present") ||
    text.includes("payment session is not present") ||
    text.includes("invalid payment session")
  );
};
