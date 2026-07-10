import { http } from "@/utils/http";

type Result = {
  code: number;
  message: string;
  data?: any;
};

type ResultTable = {
  code: number;
  message: string;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

type ResultData = {
  code: number;
  message: string;
  data?: any;
};

/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", "/user", { data });
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result>("get", "/list-all-role");
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", "/list-role-ids", { data });
};

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>("post", "/role", { data });
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<Result>("post", "/menu", { data });
};

/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>("post", "/dept", { data });
};

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/online-logs", { data });
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/login-logs", { data });
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/operation-logs", { data });
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/system-logs", { data });
};

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export const getSystemLogsDetail = (data?: object) => {
  return http.request<Result>("post", "/system-logs-detail", { data });
};

/** 获取系统监控-缓存监控信息 */
export const getCacheInfo = () => {
  return http.request<ResultData>("get", "/cache-info");
};

/** 获取角色管理-权限-菜单权限 */
export const getRoleMenu = (data?: object) => {
  return http.request<Result>("post", "/role-menu", { data });
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (data?: object) => {
  return http.request<Result>("post", "/role-menu-ids", { data });
};

// ===================== 用户管理 CRUD =====================

/** 创建用户 */
export const createUser = (data?: object) => {
  return http.request<Result>("post", "/user/create", { data });
};

/** 更新用户 */
export const updateUser = (data?: object) => {
  return http.request<Result>("put", "/user/update", { data });
};

/** 删除用户 */
export const deleteUser = (data?: object) => {
  return http.request<Result>("post", "/user/delete", { data });
};

/** 更新用户状态 */
export const updateUserStatus = (data?: object) => {
  return http.request<Result>("post", "/user/status", { data });
};

/** 重置用户密码 */
export const resetUserPassword = (data?: object) => {
  return http.request<Result>("post", "/user/reset-password", { data });
};

/** 分配用户角色 */
export const assignUserRole = (data?: object) => {
  return http.request<Result>("post", "/user/assign-role", { data });
};

// ===================== 角色管理 CRUD =====================

/** 创建角色 */
export const createRole = (data?: object) => {
  return http.request<Result>("post", "/role/create", { data });
};

/** 更新角色 */
export const updateRole = (data?: object) => {
  return http.request<Result>("put", "/role/update", { data });
};

/** 删除角色 */
export const deleteRole = (data?: object) => {
  return http.request<Result>("post", "/role/delete", { data });
};

/** 更新角色状态 */
export const updateRoleStatus = (data?: object) => {
  return http.request<Result>("post", "/role/status", { data });
};

/** 保存角色菜单权限 */
export const saveRoleMenu = (data?: object) => {
  return http.request<Result>("post", "/role/save-menu", { data });
};

// ===================== 菜单管理 CRUD =====================

/** 创建菜单 */
export const createMenu = (data?: object) => {
  return http.request<Result>("post", "/menu/create", { data });
};

/** 更新菜单 */
export const updateMenu = (data?: object) => {
  return http.request<Result>("put", "/menu/update", { data });
};

/** 删除菜单 */
export const deleteMenu = (data?: object) => {
  return http.request<Result>("post", "/menu/delete", { data });
};

// ===================== 部门管理 CRUD =====================

/** 创建部门 */
export const createDept = (data?: object) => {
  return http.request<Result>("post", "/dept/create", { data });
};

/** 更新部门 */
export const updateDept = (data?: object) => {
  return http.request<Result>("put", "/dept/update", { data });
};

/** 删除部门 */
export const deleteDept = (data?: object) => {
  return http.request<Result>("post", "/dept/delete", { data });
};

// ===================== 参数设置 CRUD =====================

/** 获取参数设置列表 */
export const getConfigList = (data?: object) => {
  return http.request<ResultTable>("post", "/config", { data });
};

/** 创建参数 */
export const createConfig = (data?: object) => {
  return http.request<Result>("post", "/config/create", { data });
};

/** 更新参数 */
export const updateConfig = (data?: object) => {
  return http.request<Result>("put", "/config/update", { data });
};

/** 删除参数 */
export const deleteConfig = (data?: object) => {
  return http.request<Result>("post", "/config/delete", { data });
};

// ===================== 通知公告 CRUD =====================

/** 获取通知公告列表 */
export const getNoticeList = (data?: object) => {
  return http.request<ResultTable>("post", "/notice", { data });
};

/** 创建通知公告 */
export const createNotice = (data?: object) => {
  return http.request<Result>("post", "/notice/create", { data });
};

/** 更新通知公告 */
export const updateNotice = (data?: object) => {
  return http.request<Result>("put", "/notice/update", { data });
};

/** 删除通知公告 */
export const deleteNotice = (data?: object) => {
  return http.request<Result>("post", "/notice/delete", { data });
};

// ===================== 操作日志 =====================

/** 删除操作日志 */
export const deleteOperLog = (data?: object) => {
  return http.request<Result>("post", "/operation-logs/delete", { data });
};

/** 清空操作日志 */
export const clearOperLog = () => {
  return http.request<Result>("post", "/operation-logs/clear", {});
};

// ===================== 登录日志 =====================

/** 删除登录日志 */
export const deleteLoginLog = (data?: object) => {
  return http.request<Result>("post", "/login-logs/delete", { data });
};

/** 清空登录日志 */
export const clearLoginLog = () => {
  return http.request<Result>("post", "/login-logs/clear", {});
};

// ===================== 服务器监控 =====================

/** 获取服务器监控信息 */
export const getServerInfo = () => {
  return http.request<Result>("get", "/server-info");
};
