import { http } from "@/utils/http";
import type { OpResult } from "@/types/contract";

/** 获取博客目录列表 */
export const getBlogCategoryList = (data?: object) => {
  return http.request<OpResult<"/blog/category", "post">>(
    "post",
    "/blog/category",
    { data }
  );
};

/** 创建博客目录 */
export const createBlogCategory = (data?: object) => {
  return http.request<OpResult<"/blog/category/create", "post">>(
    "post",
    "/blog/category/create",
    { data }
  );
};

/** 更新博客目录 */
export const updateBlogCategory = (data?: object) => {
  return http.request<OpResult<"/blog/category/update", "put">>(
    "put",
    "/blog/category/update",
    { data }
  );
};

/** 删除博客目录 */
export const deleteBlogCategory = (data?: object) => {
  return http.request<OpResult<"/blog/category/delete", "post">>(
    "post",
    "/blog/category/delete",
    { data }
  );
};

/** 获取博客文章列表 */
export const getBlogArticleList = (data?: object) => {
  return http.request<OpResult<"/blog/article", "post">>(
    "post",
    "/blog/article",
    { data }
  );
};

/** 创建博客文章 */
export const createBlogArticle = (data?: object) => {
  return http.request<OpResult<"/blog/article/create", "post">>(
    "post",
    "/blog/article/create",
    { data }
  );
};

/** 更新博客文章 */
export const updateBlogArticle = (data?: object) => {
  return http.request<OpResult<"/blog/article/update", "put">>(
    "put",
    "/blog/article/update",
    { data }
  );
};

/** 删除博客文章 */
export const deleteBlogArticle = (data?: object) => {
  return http.request<OpResult<"/blog/article/delete", "post">>(
    "post",
    "/blog/article/delete",
    { data }
  );
};

/** 发布博客文章 */
export const publishBlogArticle = (id: number) => {
  return http.request<OpResult<"/blog/article/{id}/publish", "post">>(
    "post",
    `/blog/article/${id}/publish`
  );
};

/** 下线博客文章 */
export const offlineBlogArticle = (id: number) => {
  return http.request<OpResult<"/blog/article/{id}/offline", "post">>(
    "post",
    `/blog/article/${id}/offline`
  );
};

/** 上传博客图片 */
export const uploadBlogImage = (data?: object) => {
  return http.request<OpResult<"/blog/file/upload", "post">>(
    "post",
    "/blog/file/upload",
    {
      data,
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
};
