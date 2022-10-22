import type { Order } from "@prisma/client";
import { defineStore } from "pinia";

const localStorageTokenKey = "orders";

const getDefulatDate = (): Order[] => [];
export default defineStore("orders", {
  state: () => ({ ...getLocalhostData<Order[]>(localStorageTokenKey, getDefulatDate()) })
});

function getLocalhostData<T>(key: string, defaultValue: T): T {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : defaultValue;
}
