import type { Product, Order, ProductsOnOrder } from "@prisma/client";
import { defineStore } from "pinia";
import api from "@/utils/api";
import useUserStore from "@/store/user";

const userStore = useUserStore();

const getDefualtOrders = (): (Order & { products: ProductsOnOrder[] })[] => [];
const getDefualtProducts = (): Map<string, Product> => new Map();
export default defineStore("orders", {
  state: () => ({ orders: getDefualtOrders(), products: getDefualtProducts() }),
  getters: {
    getOrdersByStatus: (state) => (status: Order["status"]) =>
      state.orders
        .filter((o) => o.status === status)
        .map((o) => ({ ...o, products: o.products.map((p) => ({ ...p, itemTotalPrice: (state.products.get(p.productId)?.price || 0) * p.quantity, description: state.products.get(p.productId) })) }))
        .map((o) => ({ ...o, totalPrice: o.products.reduce((sum, p) => sum + p.itemTotalPrice, 0) }))
  },
  actions: {
    async getOrders() {
      this.orders = await api.query(userStore.roles.admin ? "order.getAll" : "order.getMyAll");
      // Get products from orders
      const set = new Set<string>();
      this.orders.forEach((o) => o.products.forEach((p) => set.add(p.productId)));
      const products = await api.query("product.getByIds", Array.from(set));
      products.forEach((p) => this.products.set(p.id, p));
    },
    async updateOrderStatus(data: Pick<Order, "id" | "status">) {
      if (!userStore.roles.admin) return;
      await api.mutation("order.updateStatus", data);
      this.orders = this.orders.map((o) => (o.id === data.id ? { ...o, status: data.status } : o));
    },
    async cancelOrder(id: string) {
      if (!userStore.roles.user) return;
      await api.mutation("order.cancel", id);
      this.orders = this.orders.map((o) => (o.id === id ? { ...o, status: "CANCELED" } : o));
    }
  }
});
