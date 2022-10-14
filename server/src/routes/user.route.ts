import { createRouter } from "./context";
import { prisma } from "../dbClient";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const product = createRouter().query("getAll", {
  async resolve() {
    return prisma.order.findMany();
  }
});

const order = createRouter()
  .query("getAll", {
    async resolve(context) {
      return prisma.order.findMany({ where: { userId: context.ctx.token?.user }, include: { products: true } });
    }
  })

  .mutation("create", {
    input: z.array(z.object({ id: z.string().cuid(), quantity: z.number() })),
    async resolve({ ctx, input }) {
      return prisma.order.create({
        data: { userId: ctx.token?.user as string, status: "CREATED", products: { createMany: { data: input.map((p) => ({ productId: p.id, quantity: p.quantity })) } } },
        include: { products: true }
      });
    }
  })

  .mutation("update", {
    input: z.object({ id: z.string().cuid(), products: z.array(z.object({ id: z.string().cuid(), quantity: z.number() })) }),
    async resolve({ ctx, input }) {
      console.log(ctx.token);

      return prisma.order.update({
        where: { id: input.id }, //TODO:  check if owned by user
        include: { products: true },
        data: { products: { updateMany: input.products.map((p) => ({ where: { productId: p.id }, data: { quantity: p.quantity } })) } }
      });
    }
  })

  .mutation("delete", {
    input: z.object({ id: z.string().cuid() }),
    async resolve({ ctx, input }) {
      return prisma.$transaction([prisma.productsOnOrder.deleteMany({ where: { orderId: input.id } }), prisma.order.deleteMany({ where: { id: input.id, userId: ctx.token?.user } })]);
    }
  });
export default createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.token?.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "This route requires user login" });
    return next();
  })
  .merge("product.", product)
  .merge("order.", order)
  .mutation("signUp", {
    input: z.object({ email: z.string(), password: z.string() }),
    async resolve(context) {
      const { email, password } = context.input;
      return prisma.user.create({ data: { email, password_hash: password } });
    }
  })
  .query("login", {
    input: z.object({ email: z.string(), password: z.string() }),
    async resolve(context) {
      const { email, password } = context.input;
      return prisma.user.findFirst({ where: { email, password_hash: password } });
    }
  });
