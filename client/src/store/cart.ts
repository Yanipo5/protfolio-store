import { defineStore } from "pinia";
import type { Product } from "@prisma/client";

const localStorageKey = "cart-products";

export default defineStore("cart", {
  state: () => ({
    products: getLocalhostData<Product[]>(localStorageKey, [])
  }),

  actions: {
    async addToCart(p: Product) {
      this.products.push(p);
      saveLocalhostData<Product[]>(localStorageKey, this.products);
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
