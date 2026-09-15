import { http } from "@/utils/http";
import type { OpResult, Schema } from "@/types/contract";

export type PermissionMenuNode = Schema<"PermissionMenuNode">;

export const getPermissionMenuTree = () =>
  http.request<OpResult<"/admin/permission-matrix/menus/tree", "get">>(
    "get",
    "/admin/permission-matrix/menus/tree"
  );

export const getRolePermissions = (roleId: number) =>
  http.request<
    OpResult<"/admin/permission-matrix/roles/{roleId}/permissions", "get">
  >("get", `/admin/permission-matrix/roles/${roleId}/permissions`);

export const saveRolePermissions = (roleId: number, menuIds: number[]) =>
  http.request<
    OpResult<"/admin/permission-matrix/roles/{roleId}/permissions", "put">
  >("put", `/admin/permission-matrix/roles/${roleId}/permissions`, {
    data: { menuIds }
  });
