import { createRouter } from "./context";
import { prisma } from "../dbClient";
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
    input: z.object({ id: z.string().uuid(), title: z.string().optional(), inventory: z.number().optional(), price: z.number().optional() }),
    async resolve(context) {
      const { id, title, inventory, price } = context.input;
      if (!title && inventory && !price) return { id };
      return prisma.product.update({ where: { id }, data: { title, inventory, price } });
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

export default createRouter().merge("product.", product).merge("order.", order);
