import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createReview, createService, dashboardCounts, deleteService, listLeads, listProjects, listReviews, listServices, setReviewPublished, updateLeadStatus, updateService } from "./db";

const serviceInput = z.object({
  title: z.string().min(2).max(180),
  description: z.string().min(5),
  imageUrl: z.string().max(1000).optional().nullable(),
  iconKey: z.string().max(40).default("sparkles"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  publicContent: router({
    services: publicProcedure.query(async () => (await listServices()).filter(item => item.isActive === 1)),
    projects: publicProcedure.query(async () => (await listProjects()).filter(item => item.isActive === 1)),
    reviews: publicProcedure.query(async () => (await listReviews()).filter(item => item.isPublished === 1)),
  }),
  admin: router({
    overview: adminProcedure.query(async () => dashboardCounts()),
    services: adminProcedure.query(async () => listServices()),
    projects: adminProcedure.query(async () => listProjects()),
    reviews: adminProcedure.query(async () => listReviews()),
    leads: adminProcedure.query(async () => listLeads()),
    createService: adminProcedure.input(serviceInput).mutation(({ input }) => createService({ ...input, isActive: input.isActive ? 1 : 0 })),
    updateService: adminProcedure.input(serviceInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => {
      const { id, ...values } = input;
      return updateService(id, { ...values, isActive: values.isActive ? 1 : 0 });
    }),
    deleteService: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteService(input.id)),
    createReview: adminProcedure.input(z.object({ customerName: z.string().min(2).max(160), body: z.string().min(5), rating: z.number().int().min(1).max(5) })).mutation(({ input }) => createReview(input)),
    setReviewPublished: adminProcedure.input(z.object({ id: z.number().int().positive(), isPublished: z.boolean() })).mutation(({ input }) => setReviewPublished(input.id, input.isPublished)),
    updateLeadStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "contacted", "closed"]) })).mutation(({ input }) => updateLeadStatus(input.id, input.status)),
  }),
});

export type AppRouter = typeof appRouter;
