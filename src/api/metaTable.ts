import { http } from "@/utils/http";
import type { ApiResponse } from "@/utils/http/types.d";
import type { OpResult, Schema } from "@/types/contract";

type Result = ApiResponse;

/** 获取元表格列表 */
export const getMetaTableList = (data?: object) => {
  return http.request<OpResult<"/meta-table", "post">>("post", "/meta-table", {
    data
  });
};

/** 获取元表格详情 —— detail.data 含 options.value:Object 的透传字段，契约类型比视图类型弱，保持宽松 */
export const getMetaTableDetail = (id: number) => {
  return http.request<Result>("get", `/meta-table/${id}`);
};

/** 创建元表格 */
export const createMetaTable = (data?: object) => {
  return http.request<OpResult<"/meta-table/create", "post">>(
    "post",
    "/meta-table/create",
    { data }
  );
};

/** 更新元表格 */
export const updateMetaTable = (id: number, data?: object) => {
  return http.request<OpResult<"/meta-table/{id}", "put">>(
    "put",
    `/meta-table/${id}`,
    { data }
  );
};

/** 复制元表格 */
export const copyMetaTable = (id: number) => {
  return http.request<OpResult<"/meta-table/{id}/copy", "post">>(
    "post",
    `/meta-table/${id}/copy`
  );
};

/** 检查元表格删除 */
export const checkDeleteMetaTable = (id: number) => {
  return http.request<OpResult<"/meta-table/{id}/delete-check", "get">>(
    "get",
    `/meta-table/${id}/delete-check`
  );
};

/** 删除元表格 */
export const deleteMetaTable = (id: number, force = false) => {
  return http.request<OpResult<"/meta-table/{id}", "delete">>(
    "delete",
    `/meta-table/${id}?force=${force}`
  );
};

/** 获取元表格数据 */
export const getMetaDataList = (id: number, data?: object) => {
  return http.request<OpResult<"/meta-table/{id}/data", "post">>(
    "post",
    `/meta-table/${id}/data`,
    { data }
  );
};

/** 创建元表格数据 */
export const createMetaData = (id: number, data?: object) => {
  return http.request<OpResult<"/meta-table/{id}/data/create", "post">>(
    "post",
    `/meta-table/${id}/data/create`,
    { data }
  );
};

/** 更新元表格数据 */
export const updateMetaData = (id: number, dataId: number, data?: object) => {
  return http.request<OpResult<"/meta-table/{id}/data/{dataId}", "put">>(
    "put",
    `/meta-table/${id}/data/${dataId}`,
    { data }
  );
};

/** 删除元表格数据 */
export const deleteMetaData = (id: number, dataId: number) => {
  return http.request<
    OpResult<"/meta-table/{id}/data/{dataId}/delete", "post">
  >("post", `/meta-table/${id}/data/${dataId}/delete`);
};

/** 导出元表格数据 */
export const exportMetaData = (id: number, format = "EXCEL") => {
  return http.request<Blob>(
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

export type ImportableTableInfo = Schema<"ImportableTableInfo">;

export type ImportPreviewColumn = Schema<"PreviewColumn">;

export type TableImportPreview = Schema<"TableImportPreview">;

export type MetaTableImportRequest = Schema<"MetaTableImportRequest">;

/** 列出可导入的物理表 */
export const getImportableTables = () => {
  return http.request<OpResult<"/meta-table/importable-tables", "get">>(
    "get",
    "/meta-table/importable-tables"
  );
};

/** 预览物理表导入映射 */
export const getImportPreview = (tableName: string) => {
  return http.request<
    OpResult<"/meta-table/import-preview/{tableName}", "get">
  >("get", `/meta-table/import-preview/${tableName}`);
};

/** 导入已有物理表 */
export const importExistingTable = (data: MetaTableImportRequest) => {
  return http.request<OpResult<"/meta-table/import", "post">>(
    "post",
    "/meta-table/import",
    { data }
  );
};

/** 后端对全部字段有默认值，入参允许部分提供 */
export type MetaTableGenerateRequest = Partial<
  Schema<"MetaTableGenerateRequest">
>;

/** 生成元表格代码 */
export const generateMetaTableCode = (
  id: number,
  data: MetaTableGenerateRequest = {}
) => {
  return http.request<OpResult<"/meta-table/{id}/generate", "post">>(
    "post",
    `/meta-table/${id}/generate`,
    { data }
  );
};
