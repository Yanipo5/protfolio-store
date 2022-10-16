import type { clientAuthData } from "portfolio-store-server/src/routes/user.route";
import { defineStore } from "pinia";

const localStorageTokenKey = "token";

const getDefulatDate = (): clientAuthData => ({ roles: { viewer: true }, user: "" });
export default defineStore("roles", {
  state: () => ({ ...getLocalhostData<clientAuthData>(localStorageTokenKey, getDefulatDate()) }),
  getters: {},
  actions: {
    saveToken(token: clientAuthData) {
      this.user = token.user;
      this.roles = token.roles;
      localStorage.setItem(localStorageTokenKey, JSON.stringify(token));
    },
    deleteToken() {
      const data = getDefulatDate();
      this.user = data.user;
      this.roles = data.roles;
      localStorage.removeItem(localStorageTokenKey);
    }
  }
});

function getLocalhostData<T>(key: string, defaultValue: T): T {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : defaultValue;
}
