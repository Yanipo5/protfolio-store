import { createRouter } from "./context";
import { prisma } from "../dbClient";
import { z } from "zod";

export default createRouter()
  .query("getAll", {
    meta: { permission: "orders.getAll" },
    async resolve() {
      return prisma.order.findMany();
    }
  })

  .query("getMyAll", {
    meta: { permission: "orders.getMyAll" },
    async resolve(context) {
      return prisma.order.findMany({ where: { userId: context.ctx.user?.id }, include: { products: true } });
    }
  })

  .mutation("updateStatus", {
    meta: { permission: "order.complete" },
    input: z.object({ id: z.string().cuid(), status: z.enum(["CREATED", "PROCESSING", "DELIVERED"]) }),
    async resolve(context) {
      const { id, status } = context.input;
      return prisma.order.update({ where: { id }, data: { status } });
    }
  })

  .mutation("create", {
    meta: { permission: "order.create" },
    input: z.array(z.object({ id: z.string().cuid(), quantity: z.number() })),
    async resolve({ ctx, input }) {
      return prisma.order.create({
        data: { userId: ctx.user?.id as string, status: "CREATED", products: { createMany: { data: input.map((p) => ({ productId: p.id, quantity: p.quantity })) } } },
        include: { products: true }
      });
    }
  })

  .mutation("update", {
    meta: { permission: "order.update" },
    input: z.object({ id: z.string().cuid(), products: z.array(z.object({ id: z.string().cuid(), quantity: z.number() })) }),
    async resolve({ ctx, input }) {
      console.warn("Not checking user", ctx.user);

      return prisma.order.update({
        where: { id: input.id }, //TODO:  check if owned by user
        include: { products: true },
        data: { products: { updateMany: input.products.map((p) => ({ where: { productId: p.id }, data: { quantity: p.quantity } })) } }
      });
    }
  })

  .mutation("delete", {
    meta: { permission: "order.delete" },
    input: z.object({ id: z.string().cuid() }),
    async resolve({ ctx, input }) {
      return prisma.$transaction([prisma.productsOnOrder.deleteMany({ where: { orderId: input.id } }), prisma.order.deleteMany({ where: { id: input.id, userId: ctx.user?.id } })]);
    }
  });
