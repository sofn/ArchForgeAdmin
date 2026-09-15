import { http } from "@/utils/http";
import type { OpResult, Schema } from "@/types/contract";

export type SchedulerJob = Schema<"SchedulerJobResponse">;

export type SchedulerLog = Schema<"SchedulerLogResponse">;

/** 查询定时任务列表（分页） */
export const listSchedulerJobs = (data: object) =>
  http.request<OpResult<"/admin/scheduler-job", "get">>(
    "get",
    "/admin/scheduler-job",
    { params: data }
  );

/** 新增定时任务 */
export const addSchedulerJob = (data: object) =>
  http.request<OpResult<"/admin/scheduler-job/add", "post">>(
    "post",
    "/admin/scheduler-job/add",
    { data }
  );

/** 更新定时任务 */
export const updateSchedulerJob = (id: number, data: object) =>
  http.request<OpResult<"/admin/scheduler-job/update/{id}", "put">>(
    "put",
    `/admin/scheduler-job/update/${id}`,
    { data }
  );

/** 删除定时任务（软删除 + 取消调度） */
export const deleteSchedulerJob = (id: number) =>
  http.request<OpResult<"/admin/scheduler-job/{id}", "delete">>(
    "delete",
    `/admin/scheduler-job/${id}`
  );

/** 暂停定时任务 */
export const pauseSchedulerJob = (id: number) =>
  http.request<OpResult<"/admin/scheduler-job/pause/{id}", "post">>(
    "post",
    `/admin/scheduler-job/pause/${id}`
  );

/** 恢复定时任务 */
export const resumeSchedulerJob = (id: number) =>
  http.request<OpResult<"/admin/scheduler-job/resume/{id}", "post">>(
    "post",
    `/admin/scheduler-job/resume/${id}`
  );

/** 立即触发一次定时任务 */
export const runSchedulerJob = (id: number) =>
  http.request<OpResult<"/admin/scheduler-job/run/{id}", "post">>(
    "post",
    `/admin/scheduler-job/run/${id}`
  );

/** 查询任务执行日志 */
export const listSchedulerLogs = (data: object) =>
  http.request<OpResult<"/admin/scheduler-job/log", "get">>(
    "get",
    "/admin/scheduler-job/log",
    { params: data }
  );

/** 校验 cron 表达式 */
export const validateCron = (cron: string) =>
  http.request<OpResult<"/admin/scheduler-job/validate-cron", "post">>(
    "post",
    "/admin/scheduler-job/validate-cron",
    { data: { cron } }
  );
