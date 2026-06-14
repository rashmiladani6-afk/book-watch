import { profileService } from "@/features/auth/services/profileService";

export type SessionValidationResult = "valid" | "invalid" | "unknown";

const isInvalidMessage = (message?: string) => {
  const normalized = (message ?? "").toLowerCase();
  return (
    normalized.includes("unauthorized") ||
    normalized.includes("invalid token") ||
    normalized.includes("token expired") ||
    normalized.includes("session expired")
  );
};

export const validateSessionToken = async (
  token: string,
): Promise<SessionValidationResult> => {
  const trimmed = token.trim();
  if (!trimmed) return "invalid";

  try {
    const response = await profileService.getProfile(trimmed);
    if (response.status === "success" && response.data) {
      return "valid";
    }
    if (isInvalidMessage(response.message)) {
      return "invalid";
    }
    return "unknown";
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 401 || status === 403) {
      return "invalid";
    }

    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      (error as Error)?.message;
    if (isInvalidMessage(message)) {
      return "invalid";
    }

    return "unknown";
  }
};
