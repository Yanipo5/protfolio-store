import { defineStore } from "pinia";
import type { Product } from "@prisma/client";
import api from "@/utils/api";

const localStorageKey = "cart-products";
type ProdcutsInCart = Record<string, number>;
export default defineStore("cart", {
  state: () => ({
    products: getLocalhostData<ProdcutsInCart>(localStorageKey, {}),
    productsDefinitions: {} as Record<string, Product>
  }),
  getters: {
    cart(): (Product & { quantity: number; totalPrice: number })[] {
      return Object.entries(this.products).map(([id, quantity]) => {
        const product = this.productsDefinitions[id];
        return { ...product, quantity, totalPrice: quantity * product.price };
      });
    },
    cartTotal(): string {
      return this.cart.reduce((sum, p) => sum + p.totalPrice, 0).toFixed(2);
    }
  },

  actions: {
    async addToCart(p: Product) {
      const productInCart = this.products[p.id] || 0;
      this.products[p.id] = productInCart + 1;
      saveLocalhostData<ProdcutsInCart>(localStorageKey, this.products);
    },
    async getProductsDefinitions() {
      const res = await api.query("product.getByIds", Object.keys(this.products));
      this.productsDefinitions = res.reduce((obj, p) => ({ ...obj, [p.id]: p }), {});
    },
    updateProductQuantity(id: string, value: number) {
      this.products[id] = value;
      if (!value) delete this.products[id];
      saveLocalhostData<ProdcutsInCart>(localStorageKey, this.products);
    },
    orderCart() {
      const paylod = Object.entries(this.products).map(([id, quantity]) => ({ id, quantity }));
      api.mutation("order.create", paylod);
      this.products = {};
      saveLocalhostData<ProdcutsInCart>(localStorageKey, this.products);
    }
  }
});

function getLocalhostData<T>(key: string, defaultValue: T): T {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : defaultValue;
}

function saveLocalhostData<T extends {}>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}
