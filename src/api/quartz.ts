import { http } from "@/utils/http";

type Result<T = any> = {
  code: number;
  message: string;
  data?: T;
};

type ResultPage<T = any> = {
  code: number;
  message: string;
  data?: {
    list: T[];
    total: number;
    pageSize: number;
    currentPage: number;
  };
};

export type QuartzJob = {
  id: number;
  jobName: string;
  jobGroup: string;
  description?: string;
  beanName: string;
  methodName: string;
  methodParams?: string;
  cron: string;
  misfirePolicy: number;
  concurrent: boolean;
  status: number; // 1=PAUSED 2=RUNNING
  createTime: string;
  updateTime: string;
};

export type QuartzLog = {
  id: number;
  jobId: number;
  jobName: string;
  jobGroup: string;
  beanName: string;
  methodName: string;
  methodParams?: string;
  status: number; // 0=success 1=failure
  errorMessage?: string;
  durationMs: number;
  startedAt: string;
  finishedAt: string;
};

/** 查询 Quartz 任务列表（分页） */
export const listQuartzJobs = (data: object) =>
  http.request<ResultPage<QuartzJob>>("post", "/quartz/list", { data });

/** 新增 Quartz 任务 */
export const addQuartzJob = (data: object) =>
  http.request<Result<number>>("post", "/quartz/add", { data });

/** 更新 Quartz 任务 */
export const updateQuartzJob = (id: number, data: object) =>
  http.request<Result>("put", `/quartz/update/${id}`, { data });

/** 删除 Quartz 任务（软删除 + 取消调度） */
export const deleteQuartzJob = (id: number) =>
  http.request<Result>("delete", `/quartz/delete/${id}`);

/** 暂停 Quartz 任务 */
export const pauseQuartzJob = (id: number) =>
  http.request<Result>("post", `/quartz/pause/${id}`);

/** 恢复 Quartz 任务 */
export const resumeQuartzJob = (id: number) =>
  http.request<Result>("post", `/quartz/resume/${id}`);

/** 立即触发一次 Quartz 任务 */
export const runQuartzJob = (id: number) =>
  http.request<Result>("post", `/quartz/run/${id}`);

/** 查询任务执行日志 */
export const listQuartzLogs = (data: object) =>
  http.request<ResultPage<QuartzLog>>("post", "/quartz/log/list", { data });

/** 校验 cron 表达式 */
export const validateCron = (cron: string) =>
  http.request<Result<boolean>>("post", "/quartz/validate-cron", {
    data: { cron }
  });
