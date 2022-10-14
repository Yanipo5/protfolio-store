import { createRouter } from "./context";
import { prisma } from "../dbClient";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const product = createRouter()
  .mutation("add", {
    input: z.object({ title: z.string(), inventory: z.number(), price: z.number(), image: z.string().url() }),
    async resolve(context) {
      const { title, inventory, price, image } = context.input;
      return prisma.product.create({ data: { title, inventory, price, image } });
    }
  })

  .mutation("edit", {
    input: z.object({ id: z.string().cuid(), title: z.string().optional(), inventory: z.number().optional(), price: z.number().optional(), image: z.string().url().optional() }),
    async resolve(context) {
      const { id, title, inventory, price, image } = context.input;
      if (!title && inventory && !price) return { id };
      return prisma.product.update({ where: { id }, data: { title, inventory, price, image } });
    }
  })

  .mutation("delete", {
    input: z.object({ id: z.string().cuid() }),
    async resolve(context) {
      return prisma.product.delete({ where: { id: context.input.id } });
    }
  });

const order = createRouter()
  .query("getAll", {
    async resolve() {
      return prisma.order.findMany();
    }
  })

  .mutation("update", {
    input: z.object({ id: z.string().uuid(), status: z.enum(["CREATED", "PROCESSING", "DELIVERED"]) }),
    async resolve(context) {
      const { id, status } = context.input;
      return prisma.order.update({ where: { id }, data: { status } });
    }
  });

export default createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.token?.isAdmin) throw new TRPCError({ code: "UNAUTHORIZED", message: "This route requires admin authorization" });
    return next();
  })
  .merge("product.", product)
  .merge("order.", order);
