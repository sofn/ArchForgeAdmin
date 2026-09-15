import { http } from "@/utils/http";
import type { OpResult } from "@/types/contract";

export const getAsyncRoutes = () => {
  return http.request<OpResult<"/admin/auth/get-async-routes", "get">>(
    "get",
    "/admin/auth/get-async-routes"
  );
};
