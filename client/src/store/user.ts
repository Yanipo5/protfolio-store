import { defineStore } from "pinia";
import type { RoleMap } from "portfolio-store-server/src/utils/authorization";

const localStorageRolesKey = "roles";

export default defineStore("roles", {
  state: () => ({ roles: loadRolesFromLocalstore() }),
  getters: {},
  actions: {
    saveRoles(roles: RoleMap) {
      this.roles = roles;
      localStorage.setItem(localStorageRolesKey, JSON.stringify(roles));
    }
  }
});

function loadRolesFromLocalstore(): RoleMap {
  const raw = localStorage.getItem(localStorageRolesKey);
  return raw ? JSON.parse(raw) : { viewer: true };
}
