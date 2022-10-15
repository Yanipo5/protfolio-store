import { createTRPCClient } from "@trpc/client";
import superjson from "superjson";
import { httpLink } from "@trpc/client/links/httpLink";
import type { AppRouter } from "portfolio-store-server/src/routes/";

export default createTRPCClient<AppRouter>({
  transformer: superjson,
  links: [
    () =>
      ({ op, prev, next }) => {
        console.log("->", op.type, op.path, op.input);

        next(op, (result) => {
          console.log("<==", op.type, op.path, op.input, ":", result);
          prev(result);
        });
      },
    httpLink({ url: "/trpc" })
  ]
});

export const basicAuthClient = (input: { email: string; password: string }) => {
  const basicAuth = btoa(`${input.email}:${input.password}`);
  return createTRPCClient<AppRouter>({
    transformer: superjson,
    links: [httpLink({ url: "/trpc" })],
    headers: { Authorization: `Basic ${basicAuth}` }
  });
};
