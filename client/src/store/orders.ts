import { type Product, type Order, type ProductsOnOrder, OrderStatus } from "@prisma/client";
import { defineStore } from "pinia";
import api from "@/utils/api";
import useUserStore from "@/store/user";

const userStore = useUserStore();

const getDefualtOrders = (): (Order & { products: ProductsOnOrder[] })[] => [];
const getDefualtProducts = (): Map<string, Product> => new Map();
export default defineStore("orders", {
  state: () => ({ orders: getDefualtOrders(), products: getDefualtProducts() }),
  getters: {
    getOrdersByStatus: (state) => (status: OrderStatus) => state.orders.filter((o) => o.status === status)
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
      this.orders = this.orders.map((o) => (o.id === id ? { ...o, status: OrderStatus.CANCELED } : o));
    }
  }
});
