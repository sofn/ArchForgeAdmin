import { http } from "@/utils/http";
import type { OpResult } from "@/types/contract";

/** 获取文件列表 */
export const getFileList = (data?: object) => {
  return http.request<OpResult<"/file", "get">>("get", "/file", {
    params: data
  });
};

/** 上传文件 */
export const uploadFile = (data: FormData) => {
  return http.request<OpResult<"/file/upload", "post">>(
    "post",
    "/file/upload",
    {
      data,
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
};

/** 删除文件 */
export const deleteFile = (data?: { id: number }) => {
  return http.request<OpResult<"/file/{fileId}", "delete">>(
    "delete",
    `/file/${data?.id}`
  );
};

/** 下载文件 */
export const downloadFile = (id: number) => {
  return http.request<Blob>("get", `/file/download/${id}`, {
    responseType: "blob"
  });
};
