import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function contextFor(role: "admin" | "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: role === "admin" ? 1 : 2,
    openId: `${role}-user`,
    email: `${role}@example.com`,
    name: role === "admin" ? "مدير الموقع" : "زائر",
    loginMethod: "test",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return { user, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("admin dashboard permissions", () => {
  it("allows an admin to read the dashboard overview", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    await expect(caller.admin.overview()).resolves.toEqual(expect.objectContaining({ services: expect.any(Number), projects: expect.any(Number), reviews: expect.any(Number), leads: expect.any(Number), newLeads: expect.any(Number) }));
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.admin.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
