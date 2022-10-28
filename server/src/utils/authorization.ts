export type Role = "admin" | "user" | "viewer";
export type RoleMap = Partial<Record<Role, boolean>>;
export const allRoles: Role[] = ["admin", "user", "viewer"];

export type Permission =
  | "user.login"
  | "user.create"
  | "user.validate"
  | "user.logout"
  | "products.getAll"
  | "product.create"
  | "product.edit"
  | "product.delete"
  | "orders.getAll"
  | "orders.getMyAll"
  | "order.create"
  | "order.cancel"
  | "order.update"
  | "order.complete"
  | "order.delete";

export type PermissionMap = Partial<typeof permissionMap>;
export const permissionMap: Record<Permission, Role[]> = {
  //
  "user.login": allRoles,
  "user.create": allRoles,
  "user.validate": allRoles,
  "user.logout": allRoles,
  //
  "products.getAll": allRoles,
  "product.create": ["admin"],
  "product.edit": ["admin"],
  "product.delete": ["admin"],
  //
  "orders.getAll": ["admin"],
  "orders.getMyAll": ["user"],
  "order.create": ["user"],
  "order.cancel": ["user"],
  "order.update": ["user"],
  "order.complete": ["admin"],
  "order.delete": ["user"]
};

export function authorize(roles: RoleMap, permission: Permission) {
  return permissionMap[permission].some((p) => roles[p]);
}

export function authorizeRole(roles: Role[], userRoles: RoleMap) {
  return roles.some((r) => userRoles[r]);
}
