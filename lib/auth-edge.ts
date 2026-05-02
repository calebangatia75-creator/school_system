// Inline types for Edge compatibility
type AppRole = "admin" | "bursar" | "teacher" | "parent";
type SessionSubjectType = "user" | "parent";
type AppSessionPayload = {
  sub: string;
  role: AppRole;
  fullName: string;
  subjectType: SessionSubjectType;
  username?: string | null;
  phone?: string | null;
};

function toBase64(input: string) {
  // Use globalThis for Edge runtime compatibility
  const atobFn = typeof globalThis.atob === "function" ? globalThis.atob : atob;
  return atobFn(input);
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return toBase64(normalized + padding);
}

function getSessionSecret() {
  return process.env.APP_SESSION_SECRET ?? process.env.PARENT_SESSION_SECRET ?? "cbc-local-auth-secret";
}

async function hmacSha256(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  const bytes = Array.from(new Uint8Array(signature));
  return globalThis.btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function parseSessionTokenEdge(token?: string | null) {
  if (!token) return null;

  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;

  const expected = await hmacSha256(`${header}.${payload}`);
  if (expected !== signature) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as AppSessionPayload & { exp?: number };
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
