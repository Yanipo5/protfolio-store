import * as trpc from "@trpc/server";
import { createRouter } from "./context";
import { authorize } from "../utils/authorization";
import superjson from "superjson";
export { createContext } from "./context";
import user from "./user.route";
import product from "./product.route";
import order from "./order.route";

export const appRouter = createRouter()
  .middleware(async ({ meta, next, ctx }) => {
    if (!meta?.permission) throw new trpc.TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: "API Missing permission" });
    if (!authorize(ctx.user.roles, meta.permission)) throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
    return next();
  })
  .transformer(superjson)
  .merge("user.", user)
  .merge("product.", product)
  .merge("order.", order);

// export const appRouter = createRouter().transformer(superjson).merge("admin.", admin).merge("user.", user).merge("auth.", auth);
export type AppRouter = typeof appRouter;
