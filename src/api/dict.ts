import { http } from "@/utils/http";

export type DictType = {
  id: number;
  dictCode: string;
  dictName: string;
  description?: string;
  status: number;
  sort: number;
};

export type DictItem = {
  id?: number;
  dictTypeId?: number;
  itemCode: string;
  itemLabel: string;
  sort: number;
  status: number;
};

export type DictTypeDetail = DictType & {
  items?: DictItem[];
};

export type DictTypePageResult = {
  code: number;
  message: string;
  data: {
    list: DictType[];
    total: number;
    pageSize: number;
    currentPage: number;
  };
};

export const getDictTypePage = (data: {
  currentPage?: number;
  pageSize?: number;
  keyword?: string;
}) => http.request<DictTypePageResult>("post", "/dict/type", { data });

export const getDictTypeByCode = (dictCode: string) =>
  http.request<{ code: number; message: string; data: DictTypeDetail }>(
    "get",
    `/dict/type/${dictCode}`
  );

export const createDictType = (data: {
  dictCode: string;
  dictName: string;
  description?: string;
  status?: number;
  sort?: number;
  items?: Omit<DictItem, "id" | "dictTypeId">[];
}) =>
  http.request<{ code: number; message: string; data: number }>(
    "post",
    "/dict/type/create",
    { data }
  );

export const updateDictType = (id: number, data: Partial<DictType>) =>
  http.request<{ code: number; message: string; data: boolean }>(
    "put",
    `/dict/type/${id}`,
    { data }
  );

export const deleteDictType = (id: number) =>
  http.request<{ code: number; message: string; data: boolean }>(
    "delete",
    `/dict/type/${id}`
  );

export const createDictItem = (
  typeId: number,
  data: Omit<DictItem, "id" | "dictTypeId">
) =>
  http.request<{ code: number; message: string; data: number }>(
    "post",
    `/dict/type/${typeId}/item`,
    { data }
  );

export const updateDictItem = (
  id: number,
  data: Omit<DictItem, "id" | "dictTypeId">
) =>
  http.request<{ code: number; message: string; data: boolean }>(
    "put",
    `/dict/item/${id}`,
    { data }
  );

export const deleteDictItem = (id: number) =>
  http.request<{ code: number; message: string; data: boolean }>(
    "delete",
    `/dict/item/${id}`
  );
