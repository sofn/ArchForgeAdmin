import { http } from "@/utils/http";
import type { OpResult, Schema } from "@/types/contract";

export type DashboardMetrics = Schema<"DashboardMetricsResponse">;

export type DashboardTrendPoint = Schema<"DashboardTrendPoint">;

export type DashboardActivity = Schema<"DashboardActivity">;

export type DashboardTodo = Schema<"DashboardTodo">;

export const getDashboardMetrics = () =>
  http.request<OpResult<"/admin/dashboard/metrics", "get">>(
    "get",
    "/admin/dashboard/metrics"
  );

export const getDashboardTrends = (days = 7) =>
  http.request<OpResult<"/admin/dashboard/trends", "get">>(
    "get",
    `/admin/dashboard/trends?days=${days}`
  );

export const getDashboardActivities = () =>
  http.request<OpResult<"/admin/dashboard/recent-activities", "get">>(
    "get",
    "/admin/dashboard/recent-activities"
  );

export const getDashboardTodo = () =>
  http.request<OpResult<"/admin/dashboard/todo", "get">>(
    "get",
    "/admin/dashboard/todo"
  );
