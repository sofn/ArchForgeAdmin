import { http } from "@/utils/http";

type Envelope<T> = {
  code: number;
  message: string;
  data: T;
};

export type DashboardMetrics = {
  userCount: number;
  articleCount: number;
  metaTableCount: number;
  taskCount: number;
};

export type DashboardTrendPoint = {
  date: string;
  users: number;
  articles: number;
};

export type DashboardActivity = {
  type: string;
  title: string;
  time: string;
};

export type DashboardTodo = {
  title: string;
  count: number;
  href: string;
};

export const getDashboardMetrics = () =>
  http.request<Envelope<DashboardMetrics>>("get", "/admin/dashboard/metrics");

export const getDashboardTrends = (days = 7) =>
  http.request<Envelope<DashboardTrendPoint[]>>(
    "get",
    `/admin/dashboard/trends?days=${days}`
  );

export const getDashboardActivities = () =>
  http.request<Envelope<DashboardActivity[]>>(
    "get",
    "/admin/dashboard/recent-activities"
  );

export const getDashboardTodo = () =>
  http.request<Envelope<DashboardTodo[]>>("get", "/admin/dashboard/todo");
