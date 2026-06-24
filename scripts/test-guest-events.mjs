import fs from "fs";
import axios from "axios";

const envText = fs.readFileSync(".env", "utf8");
const getEnv = (key) => envText.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]?.trim() ?? "";

const email = getEnv("VITE_GARBATOWN_BROWSE_EMAIL");
const password = getEnv("VITE_GARBATOWN_BROWSE_PASSWORD");
const bearer = "Bearer 2ubGisLUnejgLUandBFhPIEel1W5R55BFsUc";
const base = "https://www.garbatown.com";

const extractAuthUser = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const payload = data;
  if (payload.user_token || payload.token || payload.access_token) return payload;
  if (payload.data) return extractAuthUser(payload.data);
  return null;
};

try {
  const loginRes = await axios.post(
    `${base}/api/v1/odoo/login`,
    {
      login: email,
      type: "password",
      password,
      fcm_token: "web-client-fallback-token",
    },
    {
      headers: { Authorization: bearer, "Content-Type": "application/json" },
      timeout: 20000,
    },
  );

  console.log("login:", loginRes.data?.status, loginRes.data?.message ?? "");
  const authUser = extractAuthUser(loginRes.data);
  const token =
    authUser?.user_token ?? authUser?.token ?? authUser?.access_token ?? null;

  if (!token) {
    console.log("No token in login response");
    console.log(JSON.stringify(loginRes.data).slice(0, 800));
    process.exit(1);
  }

  console.log("token acquired");

  const headerSets = [
    { Authorization: bearer, AuthorizationUserToken: token, "Content-Type": "application/json" },
    { Authorization: bearer, AuthorizationuserToken: token, "Content-Type": "application/json" },
    { AuthorizationUserToken: token },
    { Authorization: token },
  ];

  for (const headers of headerSets) {
    try {
      const eventsRes = await axios.get(`${base}/api/v1/odoo/popular_events`, {
        headers,
        timeout: 20000,
      });
      console.log(
        "popular_events OK with",
        Object.keys(headers).join(","),
        "count:",
        eventsRes.data?.data?.length ?? 0,
      );
      process.exit(0);
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message ?? error.message;
      console.log("popular_events fail", Object.keys(headers).join(","), status, message);
    }
  }

  process.exit(1);
} catch (error) {
  console.error("login failed:", error.response?.status, error.response?.data ?? error.message);
  process.exit(1);
}
