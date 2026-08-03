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
  sort?: number;
  options?: OptionItem[];
}

export interface MetaTable {
  id?: number;
  tableCode: string;
  tableName: string;
  description?: string;
  tablePrefix?: string;
  status?: number;
  columns?: MetaColumn[];
  createTime?: string;
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
