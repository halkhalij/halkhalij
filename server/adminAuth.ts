import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

export const ADMIN_SESSION_COOKIE = "himmat_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secretKey() {
  return createHash("sha256").update(process.env.JWT_SECRET || "local-admin-secret").digest();
}

function derivePassword(password: string) {
  return scryptSync(password, "himmat-khaleej-admin-v1", 32);
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME || "";
  const expectedPassword = process.env.ADMIN_PASSWORD || "";
  if (!expectedUsername || !expectedPassword || username !== expectedUsername) return false;
  const supplied = derivePassword(password);
  const expected = derivePassword(expectedPassword);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function createAdminSession(username: string) {
  return new SignJWT({ role: "admin", username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifyAdminSession(token: string) {
  try {
    const result = await jwtVerify(token, secretKey());
    if (result.payload.role !== "admin" || result.payload.sub !== process.env.ADMIN_USERNAME) return null;
    return { username: result.payload.sub };
  } catch {
    return null;
  }
}
