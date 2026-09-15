import { cms } from "@/router/enums";

export const cmsRouter = {
  path: "/cms",
  redirect: "/cms/category/index",
  meta: {
    icon: "ri/article-line",
    title: "CMS管理",
    rank: cms
  },
  children: [
    {
      path: "/cms/category/index",
      name: "CmsCategory",
      meta: {
        title: "目录管理",
        roles: ["admin"]
      }
    },
    {
      path: "/cms/article/index",
      name: "CmsArticle",
      meta: {
        title: "内容管理",
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;

export default {
  path: "/cms",
  redirect: "/cms/category/index",
  meta: {
    icon: "ri/article-line",
    title: "CMS管理",
    showLink: false,
    rank: cms
  }
} satisfies RouteConfigsTable;
