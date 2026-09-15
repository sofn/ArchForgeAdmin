import { http } from "@/utils/http";
import type { OpResult } from "@/types/contract";

/** 获取文件列表 */
export const getFileList = (data?: object) => {
  return http.request<OpResult<"/admin/file", "get">>("get", "/admin/file", {
    params: data
  });
};

/** 上传文件 */
export const uploadFile = (data: FormData) => {
  return http.request<OpResult<"/admin/file/upload", "post">>(
    "post",
    "/admin/file/upload",
    {
      data,
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
};

/** 删除文件 */
export const deleteFile = (data?: { id: number }) => {
  return http.request<OpResult<"/admin/file/{fileId}", "delete">>(
    "delete",
    `/admin/file/${data?.id}`
  );
};

/** 下载文件 */
export const downloadFile = (id: number) => {
  return http.request<Blob>("get", `/admin/file/download/${id}`, {
    responseType: "blob"
  });
};
