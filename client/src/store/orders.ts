import { type Order, type ProductsOnOrder, OrderStatus } from "@prisma/client";
import { defineStore } from "pinia";
import api from "@/utils/api";
import useUserStore from "@/store/user";

const userStore = useUserStore();

const getDefulatDate = (): (Order & { products: ProductsOnOrder[] })[] => [];
export default defineStore("orders", {
  state: () => ({ orders: getDefulatDate() }),
  getters: {
    getOrdersByStatus: (state) => (status: OrderStatus) => state.orders.filter((o) => o.status === status)
  },
  actions: {
    async getOrders() {
      this.orders = await api.query(userStore.roles.admin ? "order.getAll" : "order.getMyAll");
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
