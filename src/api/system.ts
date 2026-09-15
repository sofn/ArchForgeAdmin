import { http } from "@/utils/http";
import type { ApiResponse, PageData } from "@/utils/http/types.d";
import type { OpResult } from "@/types/contract";

type Result = ApiResponse;

type ResultTable = ApiResponse<PageData>;

/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<OpResult<"/admin/user", "post">>("post", "/admin/user", {
    data
  });
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<OpResult<"/admin/role/all", "get">>(
    "get",
    "/admin/role/all"
  );
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<OpResult<"/admin/user/list-role-ids", "post">>(
    "post",
    "/admin/user/list-role-ids",
    { data }
  );
};

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<OpResult<"/admin/role", "post">>("post", "/admin/role", {
    data
  });
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<OpResult<"/admin/menu", "post">>("post", "/admin/menu", {
    data
  });
};

/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<OpResult<"/admin/dept", "post">>("post", "/admin/dept", {
    data
  });
};

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: object) => {
  return http.request<OpResult<"/monitor/online-logs", "post">>(
    "post",
    "/monitor/online-logs",
    { data }
  );
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: object) => {
  return http.request<OpResult<"/admin/login-log", "post">>(
    "post",
    "/admin/login-log",
    { data }
  );
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: object) => {
  return http.request<OpResult<"/admin/operation-log", "post">>(
    "post",
    "/admin/operation-log",
    { data }
  );
};

/** 获取系统监控-系统日志列表 —— mock backlog，契约中暂无此路径 */
export const getSystemLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/system-logs", { data });
};

/** 获取系统监控-系统日志-根据 id 查日志详情 —— mock backlog */
export const getSystemLogsDetail = (data?: object) => {
  return http.request<Result>("post", "/system-logs-detail", { data });
};

/** 获取系统监控-缓存监控信息 */
export const getCacheInfo = () => {
  return http.request<OpResult<"/monitor/cache-info", "get">>(
    "get",
    "/monitor/cache-info"
  );
};

/** 获取角色管理-权限-菜单权限 */
export const getRoleMenu = (data?: object) => {
  return http.request<OpResult<"/admin/role/menu", "post">>(
    "post",
    "/admin/role/menu",
    { data }
  );
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (data?: object) => {
  return http.request<OpResult<"/admin/role/menu-ids", "post">>(
    "post",
    "/admin/role/menu-ids",
    { data }
  );
};

// ===================== 用户管理 CRUD =====================

/** 创建用户 */
export const createUser = (data?: object) => {
  return http.request<OpResult<"/admin/user/create", "post">>(
    "post",
    "/admin/user/create",
    { data }
  );
};

/** 更新用户 */
export const updateUser = (data?: object) => {
  return http.request<OpResult<"/admin/user/update", "put">>(
    "put",
    "/admin/user/update",
    { data }
  );
};

/** 删除用户 */
export const deleteUser = (data?: object) => {
  return http.request<OpResult<"/admin/user/delete", "post">>(
    "post",
    "/admin/user/delete",
    { data }
  );
};

/** 更新用户状态 */
export const updateUserStatus = (data?: object) => {
  return http.request<OpResult<"/admin/user/status", "post">>(
    "post",
    "/admin/user/status",
    { data }
  );
};

/** 重置用户密码 */
export const resetUserPassword = (data?: object) => {
  return http.request<OpResult<"/admin/user/reset-password", "post">>(
    "post",
    "/admin/user/reset-password",
    { data }
  );
};

/** 分配用户角色 */
export const assignUserRole = (data?: object) => {
  return http.request<OpResult<"/admin/user/assign-role", "post">>(
    "post",
    "/admin/user/assign-role",
    { data }
  );
};

// ===================== 角色管理 CRUD =====================

/** 创建角色 */
export const createRole = (data?: object) => {
  return http.request<OpResult<"/admin/role/create", "post">>(
    "post",
    "/admin/role/create",
    { data }
  );
};

/** 更新角色 */
export const updateRole = (data?: object) => {
  return http.request<OpResult<"/admin/role/update", "put">>(
    "put",
    "/admin/role/update",
    { data }
  );
};

/** 删除角色 */
export const deleteRole = (data?: object) => {
  return http.request<OpResult<"/admin/role/delete", "post">>(
    "post",
    "/admin/role/delete",
    { data }
  );
};

/** 更新角色状态 */
export const updateRoleStatus = (data?: object) => {
  return http.request<OpResult<"/admin/role/status", "post">>(
    "post",
    "/admin/role/status",
    { data }
  );
};

/** 保存角色菜单权限 */
export const saveRoleMenu = (data?: object) => {
  return http.request<OpResult<"/admin/role/save-menu", "post">>(
    "post",
    "/admin/role/save-menu",
    { data }
  );
};

/** 更新角色数据权限 */
export const updateRoleDataScope = (data?: object) => {
  return http.request<OpResult<"/admin/role/data-scope", "post">>(
    "post",
    "/admin/role/data-scope",
    { data }
  );
};

// ===================== 菜单管理 CRUD =====================

/** 创建菜单 */
export const createMenu = (data?: object) => {
  return http.request<OpResult<"/admin/menu/create", "post">>(
    "post",
    "/admin/menu/create",
    { data }
  );
};

/** 更新菜单 */
export const updateMenu = (data?: object) => {
  return http.request<OpResult<"/admin/menu/update", "put">>(
    "put",
    "/admin/menu/update",
    { data }
  );
};

/** 删除菜单 */
export const deleteMenu = (data?: object) => {
  return http.request<OpResult<"/admin/menu/delete", "post">>(
    "post",
    "/admin/menu/delete",
    { data }
  );
};

// ===================== 部门管理 CRUD =====================

/** 创建部门 */
export const createDept = (data?: object) => {
  return http.request<OpResult<"/admin/dept/create", "post">>(
    "post",
    "/admin/dept/create",
    { data }
  );
};

/** 更新部门 */
export const updateDept = (data?: object) => {
  return http.request<OpResult<"/admin/dept/update", "put">>(
    "put",
    "/admin/dept/update",
    { data }
  );
};

/** 删除部门 */
export const deleteDept = (data?: object) => {
  return http.request<OpResult<"/admin/dept/delete", "post">>(
    "post",
    "/admin/dept/delete",
    { data }
  );
};

// ===================== 参数设置 CRUD =====================

/** 获取参数设置列表 */
export const getConfigList = (data?: object) => {
  return http.request<OpResult<"/admin/config", "post">>(
    "post",
    "/admin/config",
    { data }
  );
};

/** 创建参数 */
export const createConfig = (data?: object) => {
  return http.request<OpResult<"/admin/config/create", "post">>(
    "post",
    "/admin/config/create",
    { data }
  );
};

/** 更新参数 */
export const updateConfig = (data?: object) => {
  return http.request<OpResult<"/admin/config/update", "put">>(
    "put",
    "/admin/config/update",
    { data }
  );
};

/** 删除参数 */
export const deleteConfig = (data?: object) => {
  return http.request<OpResult<"/admin/config/delete", "post">>(
    "post",
    "/admin/config/delete",
    { data }
  );
};

// ===================== 通知公告 CRUD =====================

/** 获取通知公告列表 */
export const getNoticeList = (data?: object) => {
  return http.request<OpResult<"/admin/notice", "post">>(
    "post",
    "/admin/notice",
    { data }
  );
};

/** 创建通知公告 */
export const createNotice = (data?: object) => {
  return http.request<OpResult<"/admin/notice/create", "post">>(
    "post",
    "/admin/notice/create",
    { data }
  );
};

/** 更新通知公告 */
export const updateNotice = (data?: object) => {
  return http.request<OpResult<"/admin/notice/update", "put">>(
    "put",
    "/admin/notice/update",
    { data }
  );
};

/** 删除通知公告 */
export const deleteNotice = (data?: object) => {
  return http.request<OpResult<"/admin/notice/delete", "post">>(
    "post",
    "/admin/notice/delete",
    { data }
  );
};

// ===================== 操作日志 =====================

/** 删除操作日志 */
export const deleteOperLog = (data?: object) => {
  return http.request<OpResult<"/admin/operation-log/delete", "post">>(
    "post",
    "/admin/operation-log/delete",
    { data }
  );
};

/** 清空操作日志 */
export const clearOperLog = () => {
  return http.request<OpResult<"/admin/operation-log/clear", "post">>(
    "post",
    "/admin/operation-log/clear",
    {}
  );
};

// ===================== 登录日志 =====================

/** 删除登录日志 */
export const deleteLoginLog = (data?: object) => {
  return http.request<OpResult<"/admin/login-log/delete", "post">>(
    "post",
    "/admin/login-log/delete",
    { data }
  );
};

/** 清空登录日志 */
export const clearLoginLog = () => {
  return http.request<OpResult<"/admin/login-log/clear", "post">>(
    "post",
    "/admin/login-log/clear",
    {}
  );
};

// ===================== 服务器监控 =====================

/** 获取服务器监控信息 */
export const getServerInfo = () => {
  return http.request<OpResult<"/admin/server", "get">>("get", "/admin/server");
};
