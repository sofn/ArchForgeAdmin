import { http } from "@/utils/http";

type Result = {
  code: number;
  message: string;
  data?: any;
};

type ResultTable = {
  code: number;
  message: string;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 获取元表格列表 */
export const getMetaTableList = (data?: object) => {
  return http.request<ResultTable>("post", "/meta-table", { data });
};

/** 获取元表格详情 */
export const getMetaTableDetail = (id: number) => {
  return http.request<Result>("get", `/meta-table/${id}`);
};

/** 创建元表格 */
export const createMetaTable = (data?: object) => {
  return http.request<Result>("post", "/meta-table/create", { data });
};

/** 更新元表格 */
export const updateMetaTable = (id: number, data?: object) => {
  return http.request<Result>("put", `/meta-table/${id}`, { data });
};

/** 复制元表格 */
export const copyMetaTable = (id: number) => {
  return http.request<Result>("post", `/meta-table/${id}/copy`);
};

/** 检查元表格删除 */
export const checkDeleteMetaTable = (id: number) => {
  return http.request<Result>("get", `/meta-table/${id}/delete-check`);
};

/** 删除元表格 */
export const deleteMetaTable = (id: number, force = false) => {
  return http.request<Result>("delete", `/meta-table/${id}?force=${force}`);
};

/** 获取元表格数据 */
export const getMetaDataList = (id: number, data?: object) => {
  return http.request<ResultTable>("post", `/meta-table/${id}/data`, { data });
};

/** 创建元表格数据 */
export const createMetaData = (id: number, data?: object) => {
  return http.request<Result>("post", `/meta-table/${id}/data/create`, {
    data
  });
};

/** 更新元表格数据 */
export const updateMetaData = (id: number, dataId: number, data?: object) => {
  return http.request<Result>("put", `/meta-table/${id}/data/${dataId}`, {
    data
  });
};

/** 删除元表格数据 */
export const deleteMetaData = (id: number, dataId: number) => {
  return http.request<Result>(
    "post",
    `/meta-table/${id}/data/${dataId}/delete`
  );
};

/** 导出元表格数据 */
export const exportMetaData = (id: number, format = "EXCEL") => {
  return http.request<Result>(
    "get",
    `/meta-table/${id}/export?format=${format}`,
    {
      responseType: "blob"
    }
  );
};

/** 导入元表格数据 */
export const importMetaData = (id: number, file: File, format = "CSV") => {
  const formData = new FormData();
  formData.append("file", file);
  return http.request<Result>(
    "post",
    `/meta-table/${id}/import?format=${format}`,
    {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
};

/** 生成元表格代码 */
export const generateMetaTableCode = (id: number, data?: object) => {
  return http.request<Result>("post", `/meta-table/${id}/generate`, { data });
};
