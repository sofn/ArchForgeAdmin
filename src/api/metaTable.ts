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

export interface ImportableTableInfo {
  /** 物理表名 */
  tableName: string;
  /** 表注释 */
  comment?: string;
  /** 列数（含审计列） */
  columnCount: number;
  /** 估算行数（-1 表示无统计） */
  estimatedRows: number;
  /** 是否满足纳管兼容条件 */
  compatible: boolean;
  /** 不兼容原因列表 */
  reasons: string[];
  /** 已注册为 meta-table */
  registered: boolean;
}

export interface ImportPreviewColumn {
  /** 物理列名（导入后即 columnCode） */
  columnCode: string;
  /** 列注释 */
  comment?: string;
  /** 是否为固定审计列 */
  audit: boolean;
  /** 映射出的 MetaColumnType；审计列或不可映射时为空 */
  dataType?: string;
  length?: number;
  precision?: number;
  scale?: number;
  /** NOT NULL 且无默认值 */
  required: boolean;
  unique: boolean;
  indexed: boolean;
  sort: number;
  /** 不可映射原因或提示 */
  warning?: string;
}

export interface TableImportPreview {
  tableName: string;
  comment?: string;
  compatible: boolean;
  reasons: string[];
  columns: ImportPreviewColumn[];
  /** 复合索引名（仅展示，不导入） */
  compositeIndexes: string[];
}

export interface MetaTableImportRequest {
  /** 物理表名（须满足纳管兼容条件） */
  tableName: string;
  /** 显示名，空则用表注释或物理名 */
  displayName?: string;
  description?: string;
}

/** 列出可导入的物理表 */
export const getImportableTables = () => {
  return http.request<Result>("get", "/meta-table/importable-tables");
};

/** 预览物理表导入映射 */
export const getImportPreview = (tableName: string) => {
  return http.request<Result>("get", `/meta-table/import-preview/${tableName}`);
};

/** 导入已有物理表 */
export const importExistingTable = (data: MetaTableImportRequest) => {
  return http.request<Result>("post", "/meta-table/import", { data });
};

export interface MetaTableGenerateRequest {
  /** 相对代码生成工作区根目录，默认 `ArchForge/example/<tableCode>` */
  backendDir?: string;
  /** 相对代码生成工作区根目录，默认 `ArchForgeAdmin/src/views/<tableCode>` */
  frontendDir?: string;
  /** 接口基础路径，默认 `/generated/<tableCode>` */
  basePath?: string;
  overwrite?: boolean;
}

/** 生成元表格代码 */
export const generateMetaTableCode = (
  id: number,
  data: MetaTableGenerateRequest = {}
) => {
  return http.request<Result>("post", `/meta-table/${id}/generate`, { data });
};
