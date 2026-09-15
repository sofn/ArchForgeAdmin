import { http } from "@/utils/http";
import type { OpResult, Schema } from "@/types/contract";

export type DictType = Schema<"DictTypeResponse">;

export type DictItem = Schema<"DictItemResponse">;

export type DictTypeDetail = DictType;

export type DictTypePageResult = OpResult<"/system/dict/type", "post">;

type DictItemInput = Omit<Schema<"DictItemRequest">, "dictTypeId">;

export const getDictTypePage = (data: {
  currentPage?: number;
  pageSize?: number;
  keyword?: string;
}) => http.request<DictTypePageResult>("post", "/system/dict/type", { data });

export const getDictTypeByCode = (dictCode: string) =>
  http.request<OpResult<"/system/dict/type/{dictCode}", "get">>(
    "get",
    `/system/dict/type/${dictCode}`
  );

export const createDictType = (data: {
  dictCode: string;
  dictName: string;
  description?: string;
  status?: number;
  sort?: number;
  items?: DictItemInput[];
}) =>
  http.request<OpResult<"/system/dict/type/create", "post">>(
    "post",
    "/system/dict/type/create",
    { data }
  );

export const updateDictType = (id: number, data: Partial<DictType>) =>
  http.request<OpResult<"/system/dict/type/{id}", "put">>(
    "put",
    `/system/dict/type/${id}`,
    { data }
  );

export const deleteDictType = (id: number) =>
  http.request<OpResult<"/system/dict/type/{id}", "delete">>(
    "delete",
    `/system/dict/type/${id}`
  );

export const createDictItem = (typeId: number, data: DictItemInput) =>
  http.request<OpResult<"/system/dict/type/{typeId}/item", "post">>(
    "post",
    `/system/dict/type/${typeId}/item`,
    { data }
  );

export const updateDictItem = (id: number, data: DictItemInput) =>
  http.request<OpResult<"/system/dict/item/{id}", "put">>(
    "put",
    `/system/dict/item/${id}`,
    { data }
  );

export const deleteDictItem = (id: number) =>
  http.request<OpResult<"/system/dict/item/{id}", "delete">>(
    "delete",
    `/system/dict/item/${id}`
  );
