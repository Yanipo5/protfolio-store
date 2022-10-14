import { describe, expect, test, afterEach } from "@jest/globals";
import { trpcClient, trpcClientBasicAuth, TrpcClientAuthenticated, prisma } from "./_utils";

describe("User", function () {
  let userId: string;

  test("signUp (create user)", async function () {
    const email = "test1@gmail.com";
    const password = "123456";
    const res = await trpcClient.mutation("user.signUp", { email, password });
    userId = res.id;
    expect(res.email).toBe(email);
    expect(password !== res.password_hash).toBe(true);
  });

  test("User login", async function () {
    const email = "test20@gmail.com";
    const password = "123456";
    const res = await trpcClient.mutation("user.signUp", { email, password });
    userId = res.id;
    await trpcClientBasicAuth(email, password).query("user.login");
  });

  test("User verify cookie", async function () {
    const trpcClient = new TrpcClientAuthenticated();
    await trpcClient.init();
    await trpcClient.client.query("user.validate");
    await trpcClient.delete();
  });

  test("Admin login", async function () {
    await trpcClientBasicAuth("admin", "admin").query("user.login");
  });

  test("Admin verify cookie", async function () {
    const trpcClient = new TrpcClientAuthenticated({ admin: true });
    await trpcClient.init();
    await trpcClient.client.query("user.validate");
  });

  afterEach(async () => {
    if (userId) await prisma.user.delete({ where: { id: userId } });
    userId = "";
  });
});
