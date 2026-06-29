import { findPaymentSessionInPayload } from "@/features/payment/utils/paymentSession";

export const ORDER_ALREADY_EXISTS_CODE = "order_already_exists";

const getRecord = (payload: unknown): Record<string, unknown> | null => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  return payload as Record<string, unknown>;
};

const getNestedData = (record: Record<string, unknown>): Record<string, unknown> | null => {
  const data = record.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return data as Record<string, unknown>;
};

export const extractCreateOrderErrorMessage = (payload: unknown): string | undefined => {
  const record = getRecord(payload);
  if (!record) return undefined;

  const nested = getNestedData(record);

  return (
    (typeof nested?.message === "string" && nested.message) ||
    (typeof record.message === "string" && record.message) ||
    undefined
  );
};

export const extractCreateOrderErrorCode = (payload: unknown): string | undefined => {
  const record = getRecord(payload);
  if (!record) return undefined;

  const nested = getNestedData(record);
  const code = nested?.code ?? record.code;
  return typeof code === "string" ? code : undefined;
};

export const extractCreateOrderId = (payload: unknown): string | undefined => {
  const record = getRecord(payload);
  if (!record) return undefined;

  const nested = getNestedData(record);
  const candidates = [nested?.order_id, nested?.orderId, record.order_id, record.orderId];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return String(candidate);
    }
  }

  return undefined;
};

export const extractCreateOrderPaymentSessionId = (payload: unknown): string | undefined =>
  findPaymentSessionInPayload(payload);

export const isOrderAlreadyExistsError = (payload: unknown, message?: string): boolean => {
  const code = extractCreateOrderErrorCode(payload);
  if (code === ORDER_ALREADY_EXISTS_CODE) return true;

  const text = (message ?? extractCreateOrderErrorMessage(payload) ?? "").toLowerCase();
  return (
    text.includes(ORDER_ALREADY_EXISTS_CODE) ||
    text.includes("order with same id") ||
    text.includes("same id is already present")
  );
};
