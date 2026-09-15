import { http } from "@/utils/http";
import type { OpResult } from "@/types/contract";

type Result = {
  code: number;
  message: string;
  data: Array<any>;
};

/** 地图数据 */
export const mapJson = (params?: object) => {
  return http.request<Result>("get", "/get-map-info", { params });
};

/** 文件上传 */
export const formUpload = data => {
  return http.request<OpResult<"/admin/file/upload", "post">>(
    "post",
    "/admin/file/upload",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
