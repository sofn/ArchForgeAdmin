import { http } from "@/utils/http";
import type { ApiResponse } from "@/utils/http/types.d";
import type { OpResult, Schema } from "@/types/contract";

type Result = ApiResponse;

/** 获取元表格列表 */
export const getMetaTableList = (data?: object) => {
  return http.request<OpResult<"/admin/meta-table", "post">>(
    "post",
    "/admin/meta-table",
    {
      data
    }
  );
};

/** 获取元表格详情（按 tableCode 寻址）—— detail.data 含 options.value:Object 的透传字段，契约类型比视图类型弱，保持宽松 */
export const getMetaTableDetail = (tableCode: string) => {
  return http.request<Result>(
    "get",
    `/admin/meta-table/${encodeURIComponent(tableCode)}`
  );
};

/** 创建元表格 */
export const createMetaTable = (data?: object) => {
  return http.request<OpResult<"/admin/meta-table/create", "post">>(
    "post",
    "/admin/meta-table/create",
    { data }
  );
};

/** 更新元表格（结构变更，columns 必填） */
export const updateMetaTable = (tableCode: string, data?: object) => {
  return http.request<OpResult<"/admin/meta-table/{tableCode}", "put">>(
    "put",
    `/admin/meta-table/${encodeURIComponent(tableCode)}`,
    { data }
  );
};

/** 更新元表格元信息（仅名称/描述/状态，不动表结构） */
export const patchMetaTable = (tableCode: string, data?: object) => {
  return http.request<OpResult<"/admin/meta-table/{tableCode}", "patch">>(
    "patch",
    `/admin/meta-table/${encodeURIComponent(tableCode)}`,
    { data }
  );
};

export type SchemaPreview = Schema<"SchemaPreview">;
export type PreviewChange = Schema<"PreviewChange">;

/** 预览 Schema 变更（diff + 违规行数 + DDL，只读不执行） */
export const previewMetaTableSchema = (tableCode: string, data?: object) => {
  return http.request<
    OpResult<"/admin/meta-table/{tableCode}/schema-preview", "post">
  >(
    "post",
    `/admin/meta-table/${encodeURIComponent(tableCode)}/schema-preview`,
    { data }
  );
};

/** 复制元表格 */
export const copyMetaTable = (tableCode: string) => {
  return http.request<OpResult<"/admin/meta-table/{tableCode}/copy", "post">>(
    "post",
    `/admin/meta-table/${encodeURIComponent(tableCode)}/copy`
  );
};

/** 检查元表格删除 */
export const checkDeleteMetaTable = (tableCode: string) => {
  return http.request<
    OpResult<"/admin/meta-table/{tableCode}/delete-check", "get">
  >("get", `/admin/meta-table/${encodeURIComponent(tableCode)}/delete-check`);
};

/** 删除元表格 */
export const deleteMetaTable = (tableCode: string, force = false) => {
  return http.request<OpResult<"/admin/meta-table/{tableCode}", "delete">>(
    "delete",
    `/admin/meta-table/${encodeURIComponent(tableCode)}?force=${force}`
  );
};

/** 获取元表格数据 */
export const getMetaDataList = (tableCode: string, data?: object) => {
  return http.request<OpResult<"/admin/meta-table/{tableCode}/data", "post">>(
    "post",
    `/admin/meta-table/${encodeURIComponent(tableCode)}/data`,
    { data }
  );
};

/** 创建元表格数据 */
export const createMetaData = (tableCode: string, data?: object) => {
  return http.request<
    OpResult<"/admin/meta-table/{tableCode}/data/create", "post">
  >("post", `/admin/meta-table/${encodeURIComponent(tableCode)}/data/create`, {
    data
  });
};

/** 更新元表格数据 */
export const updateMetaData = (
  tableCode: string,
  dataId: number,
  data?: object
) => {
  return http.request<
    OpResult<"/admin/meta-table/{tableCode}/data/{dataId}", "put">
  >(
    "put",
    `/admin/meta-table/${encodeURIComponent(tableCode)}/data/${dataId}`,
    { data }
  );
};

/** 删除元表格数据 */
export const deleteMetaData = (tableCode: string, dataId: number) => {
  return http.request<
    OpResult<"/admin/meta-table/{tableCode}/data/{dataId}/delete", "post">
  >(
    "post",
    `/admin/meta-table/${encodeURIComponent(tableCode)}/data/${dataId}/delete`
  );
};

/** 导出元表格数据 */
export const exportMetaData = (tableCode: string, format = "EXCEL") => {
  return http.request<Blob>(
    "get",
    `/admin/meta-table/${encodeURIComponent(tableCode)}/export?format=${format}`,
    {
      responseType: "blob"
    }
  );
};

/** 导入元表格数据 */
export const importMetaData = (
  tableCode: string,
  file: File,
  format = "CSV"
) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.request<Result>(
    "post",
    `/admin/meta-table/${encodeURIComponent(tableCode)}/import?format=${format}`,
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
  return http.request<OpResult<"/admin/meta-table/importable-tables", "get">>(
    "get",
    "/admin/meta-table/importable-tables"
  );
};

/** 预览物理表导入映射 */
export const getImportPreview = (tableName: string) => {
  return http.request<OpResult<"/admin/meta-table/import-preview", "get">>(
    "get",
    "/admin/meta-table/import-preview",
    { params: { tableName } }
  );
};

/** 导入已有物理表 */
export const importExistingTable = (data: MetaTableImportRequest) => {
  return http.request<OpResult<"/admin/meta-table/import", "post">>(
    "post",
    "/admin/meta-table/import",
    { data }
  );
};

/** 后端对全部字段有默认值，入参允许部分提供 */
export type MetaTableGenerateRequest = Partial<
  Schema<"MetaTableGenerateRequest">
>;

/** 生成元表格代码 */
export const generateMetaTableCode = (
  tableCode: string,
  data: MetaTableGenerateRequest = {}
) => {
  return http.request<
    OpResult<"/admin/meta-table/{tableCode}/generate", "post">
  >("post", `/admin/meta-table/${encodeURIComponent(tableCode)}/generate`, {
    data
  });
};
