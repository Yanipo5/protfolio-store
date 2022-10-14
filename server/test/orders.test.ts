import { describe, expect, test, beforeAll, afterEach } from "@jest/globals";
import { TrpcClientAuthenticated, prisma } from "./_utils";

let product: ReturnType<typeof getNewProduct>;
let productId: string;
const orderIds: string[] = [];

const getNewProduct = () => ({
  image: `http://www.test.product.image.com?img=${Date.now()}`,
  inventory: 100,
  price: 200,
  title: `test-product-title::${Date.now()}`
});

const adminAddNewProduct = async () => {
  const trpcClient = new TrpcClientAuthenticated({ admin: true });
  await trpcClient.init();
  const dbProduct = await trpcClient.client.mutation("admin.product.add", product);
  productId = dbProduct.id;
};

describe("Orders:", function () {
  describe("Create", function () {
    beforeAll(() => {
      product = getNewProduct();
    });

    test("User can add product to order", async function () {
      await adminAddNewProduct();
      const trpcClient1 = new TrpcClientAuthenticated();
      await trpcClient1.init();
      {
        const order = await trpcClient1.client.mutation("user.order.create", [{ id: productId, quantity: 1 }]);
        orderIds.push(order.id);
        const orders = await trpcClient1.client.query("user.order.getAll");
        expect(orders.length).toBe(1);
      }
    });

    test("User sees only orders created by him", async function () {
      await adminAddNewProduct();
      const trpcClient1 = new TrpcClientAuthenticated();
      await trpcClient1.init();
      {
        const order = await trpcClient1.client.mutation("user.order.create", [{ id: productId, quantity: 1 }]);
        orderIds.push(order.id);
        const orders = await trpcClient1.client.query("user.order.getAll");
        expect(orders.length).toBe(1);
      }

      const trpcClient2 = new TrpcClientAuthenticated();
      await trpcClient2.init();
      {
        const order = await trpcClient2.client.mutation("user.order.create", [{ id: productId, quantity: 1 }]);
        orderIds.push(order.id);
        const orders = await trpcClient2.client.query("user.order.getAll");
        expect(orders.length).toBe(1);
      }
      {
        const order = await trpcClient2.client.mutation("user.order.create", [{ id: productId, quantity: 1 }]);
        orderIds.push(order.id);
        const orders = await trpcClient2.client.query("user.order.getAll");
        expect(orders.length).toBe(2);
      }
    });

    afterEach(async () => {
      if (orderIds.length) await prisma.$transaction([prisma.productsOnOrder.deleteMany(), prisma.order.deleteMany(), prisma.product.deleteMany()]);
      orderIds.length = 0;
    });
  });

  describe("Edit", function () {
    beforeAll(() => {
      product = getNewProduct();
    });

    test("User can add product to an existing order", async function () {
      await adminAddNewProduct();
      const trpcClient1 = new TrpcClientAuthenticated();
      await trpcClient1.init();
      {
        const order = await trpcClient1.client.mutation("user.order.create", [{ id: productId, quantity: 1 }]);
        orderIds.push(order.id);
        expect(order.products[0].quantity).toBe(1);
      }
      {
        const order = await trpcClient1.client.mutation("user.order.update", { id: orderIds[0], products: [{ id: productId, quantity: 2 }] });
        expect(order.products[0].quantity).toBe(2);
      }
      {
        // create a second order
        const order = await trpcClient1.client.mutation("user.order.create", [{ id: productId, quantity: 1 }]);
        orderIds.push(order.id);
        expect(order.products[0].quantity).toBe(1);
      }
      {
        const orders = await trpcClient1.client.query("user.order.getAll");
        expect(orders.length).toBe(2);
        expect(orders[0]?.products[0].quantity).toBe(2);
        expect(orders[1]?.products[0].quantity).toBe(1);
      }
    });

    test("Admin can complete an order", async function () {
      await adminAddNewProduct();
      const trpcClient = new TrpcClientAuthenticated();
      await trpcClient.init();
      {
        const order = await trpcClient.client.mutation("user.order.create", [{ id: productId, quantity: 1 }]);
        orderIds.push(order.id);
        const orders = await trpcClient.client.query("user.order.getAll");
        expect(orders[0].status).toBe("CREATED");
      }

      const admin = new TrpcClientAuthenticated({ admin: true });
      await admin.init();
      await admin.client.mutation("admin.order.update", { id: orderIds[0], status: "DELIVERED" });
      {
        const orders = await trpcClient.client.query("user.order.getAll");
        expect(orders[0].status).toBe("DELIVERED");
      }
    });

    test("User can't complete an order", async function () {
      await adminAddNewProduct();
      const trpcClient = new TrpcClientAuthenticated();
      await trpcClient.init();
      {
        const order = await trpcClient.client.mutation("user.order.create", [{ id: productId, quantity: 1 }]);
        orderIds.push(order.id);
        const orders = await trpcClient.client.query("user.order.getAll");
        expect(orders[0].status).toBe("CREATED");
      }

      try {
        await trpcClient.client.mutation("admin.order.update", { id: orderIds[0], status: "DELIVERED" });
        expect(false).toBe("User added product (should be only admin)");
      } catch (error) {
        // @ts-ignore
        if (error?.data?.code) expect(error.data.code).toBe("UNAUTHORIZED");
        else throw error;
      }
    });

    afterEach(async () => {
      if (orderIds.length) await prisma.$transaction([prisma.productsOnOrder.deleteMany(), prisma.order.deleteMany(), prisma.product.deleteMany()]);
      orderIds.length = 0;
    });
  });

  describe("Delete", function () {
    beforeAll(() => {
      product = getNewProduct();
    });

    test("User can delete order", async function () {
      await adminAddNewProduct();
      const trpcClient1 = new TrpcClientAuthenticated();
      await trpcClient1.init();
      {
        const order = await trpcClient1.client.mutation("user.order.create", [{ id: productId, quantity: 1 }]);
        await trpcClient1.client.mutation("user.order.create", [{ id: productId, quantity: 1 }]);
        orderIds.push(order.id);
        expect(order.products[0].quantity).toBe(1);
        const orders = await trpcClient1.client.query("user.order.getAll");
        expect(orders.length).toBe(2);
      }
      {
        await trpcClient1.client.mutation("user.order.delete", { id: orderIds[0] });
        const orders = await trpcClient1.client.query("user.order.getAll");
        expect(orders.length).toBe(1);
      }
    });

    afterEach(async () => {
      if (orderIds.length) await prisma.$transaction([prisma.productsOnOrder.deleteMany(), prisma.order.deleteMany(), prisma.product.deleteMany()]);
      orderIds.length = 0;
    });
  });
});
