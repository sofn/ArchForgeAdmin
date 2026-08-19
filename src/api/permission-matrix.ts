import { http } from "@/utils/http";

type Envelope<T> = {
  code: number;
  message: string;
  data: T;
};

export type PermissionMenuNode = {
  id: number;
  parentId: number;
  name: string;
  permission: string;
  button: boolean;
  children: PermissionMenuNode[];
};

export const getPermissionMenuTree = () =>
  http.request<Envelope<PermissionMenuNode[]>>(
    "get",
    "/admin/permission-matrix/menus/tree"
  );

export const getRolePermissions = (roleId: number) =>
  http.request<Envelope<number[]>>(
    "get",
    `/admin/permission-matrix/roles/${roleId}/permissions`
  );

export const saveRolePermissions = (roleId: number, menuIds: number[]) =>
  http.request<Envelope<unknown>>(
    "put",
    `/admin/permission-matrix/roles/${roleId}/permissions`,
    { data: { menuIds } }
  );
