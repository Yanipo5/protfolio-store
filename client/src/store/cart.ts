import { defineStore } from "pinia";
import type { Product } from "@prisma/client";

const localStorageKey = "cart-products";
type ProdcutsInCart = Record<string, number>;
export default defineStore("cart", {
  state: () => ({
    // products: getLocalhostData<ProdcutsInCart>(localStorageKey, {})
    products: {} as ProdcutsInCart
  }),

  actions: {
    async addToCart(p: Product) {
      const productInCart = this.products[p.id] || 0;
      this.products[p.id] = productInCart + 1;
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
