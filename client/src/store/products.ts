import { defineStore } from "pinia";
import type { Product } from "@prisma/client";
import api, { sanitazeInputPayload } from "@/utils/api";

const localStorageKey = "products";
type ProductFormValues = Pick<Product, "description" | "id" | "image" | "price" | "inventory" | "title"> & { description: undefined | string; image: undefined };

const getDefualtProductDialogState = () => ({
  id: "",
  title: "My New Product",
  description: "Product description",
  inventory: 100,
  price: 9.99,
  image: ""
});

export default defineStore(localStorageKey, {
  state: () => ({
    products: getLocalhostData<Product[]>(localStorageKey, []),
    getProductsIsLoading: false,
    AddProductIsLoading: false,
    editProductIsLoading: false,
    deleteProductIsLoading: false,
    dialogFormVisible: false,
    productDialog: getDefualtProductDialogState()
  }),
  getters: {
    orderedProducts: (state) => {
      return state.products.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    },
    isProductDialogLoading: (state) => state.AddProductIsLoading || state.editProductIsLoading
  },
  actions: {
    async getProducts(ops?: Partial<{ sleep: boolean }>) {
      try {
        this.getProductsIsLoading = true;
        if (ops?.sleep) await new Promise((r) => setTimeout(r, 200));
        this.products = await api.query("product.getAll");
        saveLocalhostData(localStorageKey, this.products);
      } finally {
        this.getProductsIsLoading = false;
      }
    },
    async AddProduct() {
      try {
        this.AddProductIsLoading = true;
        await api.mutation("product.add", sanitazeInputPayload(this.productDialog));
        await this.getProducts({ sleep: true });
        this.dialogFormVisible = false;
        this.productDialog = getDefualtProductDialogState();
      } finally {
        this.AddProductIsLoading = false;
      }
    },
    async openProductDialogCreate(p: ProductFormValues & { id: string }) {
      this.productDialog = getDefualtProductDialogState();
      this.dialogFormVisible = true;
    },
    async openProductDialogEdit(p: ReturnType<typeof getDefualtProductDialogState>) {
      const { id, title, description, inventory, price, image } = p;
      this.productDialog = { id, title, description, inventory, price, image };
      this.dialogFormVisible = true;
    },
    async editProduct() {
      try {
        this.editProductIsLoading = true;
        await api.mutation("product.edit", sanitazeInputPayload(this.productDialog));
        await this.getProducts({ sleep: true });
        this.dialogFormVisible = false;
        this.productDialog = getDefualtProductDialogState();
      } finally {
        this.editProductIsLoading = false;
      }
    },
    async deleteProduct(id: string) {
      try {
        this.deleteProductIsLoading = true;
        await api.mutation("product.delete", { id });
        await this.getProducts({ sleep: true });
      } finally {
        this.deleteProductIsLoading = false;
      }
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
