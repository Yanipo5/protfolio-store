import { createRouter } from "./context";
import { prisma } from "../dbClient";
import { z } from "zod";

const product = createRouter().query("getAll", {
  async resolve() {
    return prisma.order.findMany();
  }
});

const order = createRouter()
  .mutation("create", {
    input: z.array(z.object({ id: z.string().uuid(), price: z.number(), quantity: z.number() })),
    async resolve(context) {
      return prisma.order.create({ data: { status: "CREATED", products: { create: context.input.map((p) => ({ product: p.id, price: p.price, quantity: p.quantity })) } } });
    }
  })

  .mutation("getAll", {
    input: z.object({ id: z.string().uuid(), status: z.enum(["CREATED", "PROCESSING", "DELIVERED"]) }),
    async resolve(context) {
      const { id, status } = context.input;
      return prisma.order.update({ where: { id }, data: { status } });
    }
  });

export default createRouter()
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
