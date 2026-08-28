import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "../adminAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }

  if (!user) {
    const rawCookie = opts.req.headers.cookie || "";
    const token = rawCookie.split(";").map(part => part.trim()).find(part => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))?.slice(ADMIN_SESSION_COOKIE.length + 1);
    if (token) {
      const session = await verifyAdminSession(token);
      if (session) {
        const now = new Date();
        const username = session.username ?? process.env.ADMIN_USERNAME ?? "admin";
        user = { id: 0, openId: username, name: "مدير همة الخليج", email: null, loginMethod: "admin-password", role: "admin", createdAt: now, updatedAt: now, lastSignedIn: now };
      }
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
