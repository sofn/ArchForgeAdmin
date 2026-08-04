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

/** 获取博客目录列表 */
export const getBlogCategoryList = (data?: object) => {
  return http.request<ResultTable>("post", "/blog/category", { data });
};

/** 创建博客目录 */
export const createBlogCategory = (data?: object) => {
  return http.request<Result>("post", "/blog/category/create", { data });
};

/** 更新博客目录 */
export const updateBlogCategory = (data?: object) => {
  return http.request<Result>("put", "/blog/category/update", { data });
};

/** 删除博客目录 */
export const deleteBlogCategory = (data?: object) => {
  return http.request<Result>("post", "/blog/category/delete", { data });
};

/** 获取博客文章列表 */
export const getBlogArticleList = (data?: object) => {
  return http.request<ResultTable>("post", "/blog/article", { data });
};

/** 创建博客文章 */
export const createBlogArticle = (data?: object) => {
  return http.request<Result>("post", "/blog/article/create", { data });
};

/** 更新博客文章 */
export const updateBlogArticle = (data?: object) => {
  return http.request<Result>("put", "/blog/article/update", { data });
};

/** 删除博客文章 */
export const deleteBlogArticle = (data?: object) => {
  return http.request<Result>("post", "/blog/article/delete", { data });
};

/** 发布博客文章 */
export const publishBlogArticle = (id: number) => {
  return http.request<Result>("post", `/blog/article/${id}/publish`);
};

/** 下线博客文章 */
export const offlineBlogArticle = (id: number) => {
  return http.request<Result>("post", `/blog/article/${id}/offline`);
};

/** 上传博客图片 */
export const uploadBlogImage = (data?: object) => {
  return http.request<any>("post", "/blog/file/upload", {
    data,
    headers: { "Content-Type": "multipart/form-data" }
  });
};
