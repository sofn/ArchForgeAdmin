import { http } from "@/utils/http";
import type { ApiResponse } from "@/utils/http/types.d";

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

export type DictTypePageResult = ApiResponse<{
  list: DictType[];
  total: number;
  pageSize: number;
  currentPage: number;
}>;

export const getDictTypePage = (data: {
  currentPage?: number;
  pageSize?: number;
  keyword?: string;
}) => http.request<DictTypePageResult>("post", "/system/dict/type", { data });

export const getDictTypeByCode = (dictCode: string) =>
  http.request<{ code: number; message: string; data: DictTypeDetail }>(
    "get",
    `/system/dict/type/${dictCode}`
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
    "/system/dict/type/create",
    { data }
  );

export const updateDictType = (id: number, data: Partial<DictType>) =>
  http.request<{ code: number; message: string; data: boolean }>(
    "put",
    `/system/dict/type/${id}`,
    { data }
  );

export const deleteDictType = (id: number) =>
  http.request<{ code: number; message: string; data: boolean }>(
    "delete",
    `/system/dict/type/${id}`
  );

export const createDictItem = (
  typeId: number,
  data: Omit<DictItem, "id" | "dictTypeId">
) =>
  http.request<{ code: number; message: string; data: number }>(
    "post",
    `/system/dict/type/${typeId}/item`,
    { data }
  );

export const updateDictItem = (
  id: number,
  data: Omit<DictItem, "id" | "dictTypeId">
) =>
  http.request<{ code: number; message: string; data: boolean }>(
    "put",
    `/system/dict/item/${id}`,
    { data }
  );

export const deleteDictItem = (id: number) =>
  http.request<{ code: number; message: string; data: boolean }>(
    "delete",
    `/system/dict/item/${id}`
  );
