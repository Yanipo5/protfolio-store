import { describe, expect, test, beforeAll, afterEach } from "@jest/globals";
import { TrpcClientAuthenticated, prisma } from "./_utils";

const getNewProduct = () => ({
  image: `http://www.test.product.image.com?img=${Date.now()}`,
  inventory: 100,
  price: 200,
  title: `test-product-title::${Date.now()}`
});

describe("Products:", function () {
  describe("Add Product", function () {
    let product: ReturnType<typeof getNewProduct>;
    let productId: string;
    beforeAll(() => {
      product = getNewProduct();
    });
    test("Admin can add product", async function () {
      const trpcClient = new TrpcClientAuthenticated({ admin: true });
      await trpcClient.init();
      const dbProduct = await trpcClient.client.mutation("admin.product.add", product);
      productId = dbProduct.id;
    });

    test("User can't add product", async function () {
      const trpcClient = new TrpcClientAuthenticated();
      await trpcClient.init();
      try {
        const dbProduct = await trpcClient.client.mutation("admin.product.add", product);
        productId = dbProduct.id;
        expect(false).toBe("User added product (should be only admin)");
      } catch (error) {
        // @ts-ignore
        if (error?.data?.code) expect(error.data.code).toBe("UNAUTHORIZED");
        else throw "unkown error";
      }
    });

    afterEach(() => {
      if (productId) prisma.product.delete({ where: { id: productId } });
    });
  });

  describe("Edit Product", function () {
    let product: ReturnType<typeof getNewProduct>;
    let productId: string;
    beforeAll(() => {
      product = getNewProduct();
    });
    test("Admin can edit a product", async function () {
      const trpcClient = new TrpcClientAuthenticated({ admin: true });
      await trpcClient.init();
      const dbProduct = await trpcClient.client.mutation("admin.product.add", product);
      productId = dbProduct.id;

      await trpcClient.client.mutation("admin.product.edit", {
        id: productId,
        inventory: 999,
        price: 888,
        title: `new-test-product-title::${Date.now()}`,
        // @ts-ignore
        image: `http://www.test.product.new-image.com?img=${Date.now()}`
      });
    });

    test("User can't edit a product", async function () {
      const trpcClientAdmin = new TrpcClientAuthenticated({ admin: true });
      await trpcClientAdmin.init();
      const dbProduct = await trpcClientAdmin.client.mutation("admin.product.add", product);
      productId = dbProduct.id;

      const trpcClient = new TrpcClientAuthenticated();
      try {
        await trpcClient.client.mutation("admin.product.edit", {
          id: productId,
          inventory: 999,
          price: 888,
          title: `new-test-product-title::${Date.now()}`,
          // @ts-ignore
          image: `http://www.test.product.new-image.com?img=${Date.now()}`
        });
        expect(false).toBe("User added product (should be only admin)");
      } catch (error) {
        // @ts-ignore
        if (error?.data?.code) expect(error.data.code).toBe("UNAUTHORIZED");
        else throw "unkown error";
      }
    });

    afterEach(() => {
      if (productId) prisma.product.delete({ where: { id: productId } });
    });
  });

  describe("Delete Product", function () {
    let product: ReturnType<typeof getNewProduct>;
    let productId: string;
    beforeAll(() => {
      product = getNewProduct();
    });
    test("Admin can edit a product", async function () {
      const trpcClient = new TrpcClientAuthenticated({ admin: true });
      await trpcClient.init();
      const dbProduct = await trpcClient.client.mutation("admin.product.add", product);
      productId = dbProduct.id;

      await trpcClient.client.mutation("admin.product.delete", { id: productId });
    });

    test("User can't edit a product", async function () {
      const trpcClientAdmin = new TrpcClientAuthenticated({ admin: true });
      await trpcClientAdmin.init();
      const dbProduct = await trpcClientAdmin.client.mutation("admin.product.add", product);
      productId = dbProduct.id;

      const trpcClient = new TrpcClientAuthenticated();
      try {
        await trpcClient.client.mutation("admin.product.delete", { id: productId });
        expect(false).toBe("User added product (should be only admin)");
      } catch (error) {
        // @ts-ignore
        if (error?.data?.code) expect(error.data.code).toBe("UNAUTHORIZED");
        else throw "unkown error";
      }
    });

    afterEach(() => {
      if (productId) prisma.product.delete({ where: { id: productId } });
    });
  });
});
