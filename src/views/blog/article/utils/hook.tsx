import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getBlogArticleList,
  createBlogArticle,
  updateBlogArticle,
  deleteBlogArticle,
  publishBlogArticle,
  offlineBlogArticle
} from "@/api/blog";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormItemProps } from "./types";
import { deviceDetection } from "@pureadmin/utils";
import { hasPerms } from "@/utils/auth";

export function useArticle() {
  const form = reactive({
    title: "",
    status: ""
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 80 },
    { label: "标题", prop: "title", minWidth: 200 },
    { label: "目录", prop: "categoryName", minWidth: 120 },
    { label: "URL标识", prop: "slug", minWidth: 160 },
    {
      label: "状态",
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => {
        const type =
          row.status === 0 ? "info" : row.status === 1 ? "success" : "warning";
        const label =
          row.status === 0 ? "草稿" : row.status === 1 ? "已发布" : "已下线";
        return <el-tag type={type}>{label}</el-tag>;
      }
    },
    {
      label: "发布时间",
      prop: "publishTime",
      minWidth: 160,
      formatter: ({ publishTime }) =>
        publishTime ? dayjs(publishTime).format("YYYY-MM-DD HH:mm:ss") : ""
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        createTime ? dayjs(createTime).format("YYYY-MM-DD HH:mm:ss") : ""
    },
    { label: "操作", fixed: "right", width: 240, slot: "operation" }
  ];

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const status = form.status === "" ? null : Number(form.status);
    const { code, data } = await getBlogArticleList({
      title: toRaw(form).title,
      status,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    if (code === 0) {
      dataList.value = data.list;
      pagination.total = data.total;
      pagination.pageSize = data.pageSize;
      pagination.currentPage = data.currentPage;
    }
    setTimeout(() => (loading.value = false), 300);
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}文章`,
      props: {
        formInline: {
          categoryId: row?.categoryId ?? null,
          title: row?.title ?? "",
          slug: row?.slug ?? "",
          summary: row?.summary ?? "",
          content: row?.content ?? "",
          coverImageFileId: row?.coverImageFileId ?? null,
          coverImageUrl: row?.coverImageUrl ?? "",
          status: row?.status ?? 0
        }
      },
      width: "60%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (valid) {
            if (title === "新增") {
              await createBlogArticle(curData);
            } else {
              await updateBlogArticle({ ...curData, id: row?.id });
            }
            message(`您${title}了文章${curData.title}`, { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleDelete(row) {
    await deleteBlogArticle({ id: row.id });
    message(`您删除了文章${row.title}`, { type: "success" });
    onSearch();
  }

  async function handlePublish(row) {
    await publishBlogArticle(row.id);
    message(`已发布文章${row.title}`, { type: "success" });
    onSearch();
  }

  async function handleOffline(row) {
    await offlineBlogArticle(row.id);
    message(`已下线文章${row.title}`, { type: "success" });
    onSearch();
  }

  onMounted(() => onSearch());

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handlePublish,
    handleOffline,
    handleSizeChange,
    handleCurrentChange,
    hasPerms
  };
}
