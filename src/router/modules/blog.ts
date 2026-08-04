import { blog } from "@/router/enums";

export const blogRouter = {
  path: "/blog",
  redirect: "/blog/category/index",
  meta: {
    icon: "ri/article-line",
    title: "博客管理",
    rank: blog
  },
  children: [
    {
      path: "/blog/category/index",
      name: "BlogCategory",
      meta: {
        title: "目录管理",
        roles: ["admin"]
      }
    },
    {
      path: "/blog/article/index",
      name: "BlogArticle",
      meta: {
        title: "内容管理",
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;

export default {
  path: "/blog",
  redirect: "/blog/category/index",
  meta: {
    icon: "ri/article-line",
    title: "博客管理",
    showLink: false,
    rank: blog
  }
} satisfies RouteConfigsTable;
