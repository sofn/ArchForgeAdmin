import { http } from "@/utils/http";

type Result = {
  code: number;
  message: string;
  data?: any;
};

type ResultPage = {
  code: number;
  message: string;
  data?: {
    list: Array<any>;
    total: number;
    pageSize: number;
    currentPage: number;
  };
};

/** 获取文件列表 */
export const getFileList = (data?: object) => {
  return http.request<ResultPage>("get", "/file", { params: data });
};

/** 上传文件 */
export const uploadFile = (data: FormData) => {
  return http.request<Result>("post", "/file/upload", {
    data,
    headers: { "Content-Type": "multipart/form-data" }
  });
};

/** 删除文件 */
export const deleteFile = (data?: { id: number }) => {
  return http.request<Result>("delete", `/file/${data?.id}`);
};

/** 下载文件 */
export const downloadFile = (id: number) => {
  return http.request<Blob>("get", `/file/download/${id}`, {
    responseType: "blob"
  });
};
