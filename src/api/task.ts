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

/** 获取任务列表 */
export const getTaskList = (data?: object) => {
  return http.request<ResultTable>("post", "/task", { data });
};

/** 创建任务 */
export const createTask = (data?: object) => {
  return http.request<Result>("post", "/task/create", { data });
};

/** 更新任务 */
export const updateTask = (data?: object) => {
  return http.request<Result>("put", "/task/update", { data });
};

/** 删除任务 */
export const deleteTask = (data?: object) => {
  return http.request<Result>("post", "/task/delete", { data });
};

/** 开始任务 */
export const startTask = (data?: object) => {
  return http.request<Result>("post", "/task/start", { data });
};

/** 完成任务 */
export const completeTask = (data?: object) => {
  return http.request<Result>("post", "/task/complete", { data });
};

/** 取消任务 */
export const cancelTask = (data?: object) => {
  return http.request<Result>("post", "/task/cancel", { data });
};
