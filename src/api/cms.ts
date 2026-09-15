import { http } from "@/utils/http";
import type { OpResult } from "@/types/contract";

/** 获取CMS目录列表 */
export const getCmsCategoryList = (data?: object) => {
  return http.request<OpResult<"/admin/cms/category", "post">>(
    "post",
    "/admin/cms/category",
    { data }
  );
};

/** 创建CMS目录 */
export const createCmsCategory = (data?: object) => {
  return http.request<OpResult<"/admin/cms/category/create", "post">>(
    "post",
    "/admin/cms/category/create",
    { data }
  );
};

/** 更新CMS目录 */
export const updateCmsCategory = (data?: object) => {
  return http.request<OpResult<"/admin/cms/category/update", "put">>(
    "put",
    "/admin/cms/category/update",
    { data }
  );
};

/** 删除CMS目录 */
export const deleteCmsCategory = (data?: object) => {
  return http.request<OpResult<"/admin/cms/category/delete", "post">>(
    "post",
    "/admin/cms/category/delete",
    { data }
  );
};

/** 获取CMS文章列表 */
export const getCmsArticleList = (data?: object) => {
  return http.request<OpResult<"/admin/cms/article", "post">>(
    "post",
    "/admin/cms/article",
    { data }
  );
};

/** 创建CMS文章 */
export const createCmsArticle = (data?: object) => {
  return http.request<OpResult<"/admin/cms/article/create", "post">>(
    "post",
    "/admin/cms/article/create",
    { data }
  );
};

/** 更新CMS文章 */
export const updateCmsArticle = (data?: object) => {
  return http.request<OpResult<"/admin/cms/article/update", "put">>(
    "put",
    "/admin/cms/article/update",
    { data }
  );
};

/** 删除CMS文章 */
export const deleteCmsArticle = (data?: object) => {
  return http.request<OpResult<"/admin/cms/article/delete", "post">>(
    "post",
    "/admin/cms/article/delete",
    { data }
  );
};

/** 发布CMS文章 */
export const publishCmsArticle = (id: number) => {
  return http.request<OpResult<"/admin/cms/article/{id}/publish", "post">>(
    "post",
    `/admin/cms/article/${id}/publish`
  );
};

/** 下线CMS文章 */
export const offlineCmsArticle = (id: number) => {
  return http.request<OpResult<"/admin/cms/article/{id}/offline", "post">>(
    "post",
    `/admin/cms/article/${id}/offline`
  );
};

/** 上传CMS图片 */
export const uploadCmsImage = (data?: object) => {
  return http.request<OpResult<"/admin/cms/file/upload", "post">>(
    "post",
    "/admin/cms/file/upload",
    {
      data,
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
};
