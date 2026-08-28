import { desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, leads, projects, reviews, services, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  values.lastSignedIn ??= new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listServices() { const db = await getDb(); return db ? db.select().from(services).orderBy(services.sortOrder, services.id) : []; }
export async function listProjects() { const db = await getDb(); return db ? db.select().from(projects).orderBy(projects.sortOrder, projects.id) : []; }
export async function listReviews() { const db = await getDb(); return db ? db.select().from(reviews).orderBy(desc(reviews.createdAt)) : []; }
export async function listLeads() { const db = await getDb(); return db ? db.select().from(leads).orderBy(desc(leads.createdAt)).limit(100) : []; }

export async function dashboardCounts() {
  const db = await getDb();
  if (!db) return { services: 0, projects: 0, reviews: 0, leads: 0, newLeads: 0 };
  const [a, b, c, d, e] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(services),
    db.select({ count: sql<number>`count(*)` }).from(projects),
    db.select({ count: sql<number>`count(*)` }).from(reviews),
    db.select({ count: sql<number>`count(*)` }).from(leads),
    db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, "new")),
  ]);
  return { services: Number(a[0]?.count ?? 0), projects: Number(b[0]?.count ?? 0), reviews: Number(c[0]?.count ?? 0), leads: Number(d[0]?.count ?? 0), newLeads: Number(e[0]?.count ?? 0) };
}

export async function createService(input: typeof services.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.insert(services).values(input); }
export async function updateService(id: number, input: Partial<typeof services.$inferInsert>) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.update(services).set(input).where(eq(services.id, id)); }
export async function deleteService(id: number) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.delete(services).where(eq(services.id, id)); }
export async function createReview(input: typeof reviews.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.insert(reviews).values({ ...input, isPublished: 0 }); }
export async function setReviewPublished(id: number, isPublished: boolean) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.update(reviews).set({ isPublished: isPublished ? 1 : 0 }).where(eq(reviews.id, id)); }
export async function updateLeadStatus(id: number, status: "new" | "contacted" | "closed") { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.update(leads).set({ status }).where(eq(leads.id, id)); }
