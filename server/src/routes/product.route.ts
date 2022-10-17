import { createRouter } from "./context";
import { prisma } from "../dbClient";
import { z } from "zod";

export default createRouter()
  .query("getAll", {
    meta: { permission: "products.getAll" },
    async resolve() {
      return prisma.product.findMany();
    }
  })

  .mutation("add", {
    meta: { permission: "product.create" },
    input: z.object({ title: z.string(), inventory: z.number(), price: z.number(), image: z.string().url().optional() }),
    async resolve(context) {
      return prisma.product.create({ data: context.input });
    }
  })

  .mutation("edit", {
    meta: { permission: "product.edit" },
    input: z.object({ id: z.string().cuid(), title: z.string().optional(), inventory: z.number().optional(), price: z.number().optional(), image: z.string().url().optional() }),
    async resolve(context) {
      const { id, title, inventory, price, image } = context.input;
      if (!title && inventory && !price) return { id };
      return prisma.product.update({ where: { id }, data: { title, inventory, price, image } });
    }
  })

  .mutation("delete", {
    meta: { permission: "product.delete" },
    input: z.object({ id: z.string().cuid() }),
    async resolve(context) {
      return prisma.product.delete({ where: { id: context.input.id } });
    }
  });
