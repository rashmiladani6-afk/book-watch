import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

const GARBA_BEARER = "Bearer 2ubGisLUnejgLUandBFhPIEel1W5R55BFsUc";
const GARBA_BASE = "https://www.garbatown.com";

const parseEnvFile = (filePath: string) => {
  const values: Record<string, string> = {};
  if (!fs.existsSync(filePath)) return values;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    values[trimmed.slice(0, separator).trim()] = trimmed.slice(separator + 1).trim();
  }

  return values;
};

const extractToken = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  const direct =
    (typeof data.user_token === "string" && data.user_token) ||
    (typeof data.token === "string" && data.token) ||
    (typeof data.access_token === "string" && data.access_token) ||
    null;

  if (direct) return direct.replace(/^Bearer\s+/i, "");
  if (data.data) return extractToken(data.data);
  return null;
};

export const guestEventsApiPlugin = (): Plugin => {
  let cachedToken: string | null = null;

  const resolveGuestToken = async (env: Record<string, string>) => {
    const configuredToken = env.VITE_GARBATOWN_GUEST_USER_TOKEN?.trim();
    if (configuredToken) return configuredToken.replace(/^Bearer\s+/i, "");
    if (cachedToken) return cachedToken;

    const email = env.VITE_GARBATOWN_BROWSE_EMAIL?.trim();
    const password = env.VITE_GARBATOWN_BROWSE_PASSWORD?.trim();
    if (!email || !password) {
      throw new Error(
        "Guest browse is not configured. Set VITE_GARBATOWN_GUEST_USER_TOKEN or browse email/password in .env",
      );
    }

    const loginResponse = await fetch(`${GARBA_BASE}/api/v1/odoo/login`, {
      method: "POST",
      headers: {
        Authorization: GARBA_BEARER,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: email,
        type: "password",
        password,
        fcm_token: "web-client-fallback-token",
      }),
    });

    const loginData = await loginResponse.json();
    if (!loginResponse.ok || loginData?.status === "error") {
      throw new Error(loginData?.message || "Guest browse login failed");
    }

    const token = extractToken(loginData);
    if (!token) {
      throw new Error("Guest browse login succeeded but no user token was returned");
    }

    cachedToken = token;
    return token;
  };

  const fetchPopularEvents = async (token: string) => {
    const headerSets = [
      {
        Authorization: GARBA_BEARER,
        AuthorizationUserToken: token,
        "Content-Type": "application/json",
      },
      {
        Authorization: GARBA_BEARER,
        AuthorizationuserToken: token,
        "Content-Type": "application/json",
      },
    ];

    let lastError: Error | null = null;
    for (const headers of headerSets) {
      const response = await fetch(`${GARBA_BASE}/api/v1/odoo/popular_events`, { headers });
      const data = await response.json();
      if (response.ok && data?.status !== "error") {
        return data;
      }
      lastError = new Error(data?.message || `popular_events failed (${response.status})`);
    }

    throw lastError ?? new Error("Could not load popular events");
  };

  return {
    name: "guest-events-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== "/api/guest/popular-events") {
          next();
          return;
        }

        try {
          const env = parseEnvFile(path.resolve(process.cwd(), ".env"));
          const token = await resolveGuestToken(env);
          const data = await fetchPopularEvents(token);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "error",
              message: error instanceof Error ? error.message : "Guest events request failed",
            }),
          );
        }
      });
    },
  };
};
