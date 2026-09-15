import { http } from "@/utils/http";
import type { OpResult } from "@/types/contract";

export const getAsyncRoutes = () => {
  return http.request<OpResult<"/auth/get-async-routes", "get">>(
    "get",
    "/auth/get-async-routes"
  );
};
