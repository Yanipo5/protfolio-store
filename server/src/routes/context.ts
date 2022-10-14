import type { inferAsyncReturnType } from "@trpc/server";
import { env } from "../envSchema";
import * as trpcExpress from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import * as trpc from "@trpc/server";

export type token = { user: string; isAdmin?: boolean };
export type Context = inferAsyncReturnType<typeof createContext>;
export const createContext = (o: trpcExpress.CreateExpressContextOptions) => {
  const token = o.req.cookies["token"];
  return {
    req: o.req,
    res: o.res,
    env,
    token: token ? verifyJwt(token) : undefined
  };
};
export const createRouter = () => trpc.router<Context>();

export const signJwt = (payload: token): string => jwt.sign(payload, env.AUTHORIZATION_SIGNATURE);
export const verifyJwt = (token: string) => jwt.verify(token, env.AUTHORIZATION_SIGNATURE) as token;
