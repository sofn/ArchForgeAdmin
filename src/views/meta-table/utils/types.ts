export interface OptionItem {
  label: string;
  value: string | number;
}

export interface MetaColumn {
  id?: number;
  columnCode: string;
  columnName: string;
  dataType: string;
  length?: number;
  precision?: number;
  scale?: number;
  nullable?: boolean;
  defaultValue?: string;
  unique?: boolean;
  required?: boolean;
  searchable?: boolean;
  listVisible?: boolean;
  index?: boolean;
  indexType?: string;
  indexGroup?: string;
  sort?: number;
  options?: OptionItem[];
  dictCode?: string;
  arrayElementType?: string;
  searchType?: string;
}

export interface MetaTable {
  id?: number;
  tableCode: string;
  tableName: string;
  description?: string;
  tablePrefix?: string;
  status?: number;
  columns?: MetaColumn[];
  creatorId?: number;
  creatorName?: string;
  createTime?: string;
  updaterId?: number;
  updaterName?: string;
  updateTime?: string;
}

export interface TableFormProps {
  formInline: MetaTable;
}

export interface FieldFormProps {
  formInline: MetaColumn;
}

export interface DataFormProps {
  formInline: Record<string, any>;
  columns: MetaColumn[];
}
