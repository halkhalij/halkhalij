import { describe, expect, it } from "vitest";
import { verifyAdminCredentials } from "./adminAuth";

describe("admin credentials", () => {
  it("accepts the configured admin secret", () => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    expect(username).toBeTruthy();
    expect(password).toBeTruthy();
    expect(verifyAdminCredentials(username ?? "", password ?? "")).toBe(true);
  });

  it("rejects incorrect credentials", () => {
    expect(verifyAdminCredentials("wrong-user", "wrong-password")).toBe(false);
  });
});


describe("adminLogin procedure", () => {
  it("issues a protected session cookie for valid credentials", async () => {
    const cookies: Array<{ name: string; value: string }> = [];
    const caller = (await import("./routers")).appRouter.createCaller({
      user: null,
      req: {} as import("./_core/context").TrpcContext["req"],
      res: { cookie: (name: string, value: string) => cookies.push({ name, value }) } as import("./_core/context").TrpcContext["res"],
    });
    const result = await caller.adminLogin({ username: process.env.ADMIN_USERNAME ?? "", password: process.env.ADMIN_PASSWORD ?? "" });
    expect(result).toEqual({ success: true });
    expect(cookies[0]?.name).toBe("himmat_admin_session");
    expect(cookies[0]?.value).toBeTruthy();
  });
});
