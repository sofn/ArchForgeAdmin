import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getBlogCategoryList,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory
} from "@/api/blog";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormItemProps } from "./types";
import { deviceDetection } from "@pureadmin/utils";

export function useCategory() {
  const form = reactive({
    name: ""
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
    { label: "分类名称", prop: "name", minWidth: 160 },
    { label: "URL标识", prop: "slug", minWidth: 160 },
    { label: "排序", prop: "sortOrder", width: 100 },
    {
      label: "状态",
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.status === 1 ? undefined : "info"}>
          {row.status === 1 ? "显示" : "隐藏"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        createTime ? dayjs(createTime).format("YYYY-MM-DD HH:mm:ss") : ""
    },
    { label: "操作", fixed: "right", width: 180, slot: "operation" }
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
    const { code, data } = await getBlogCategoryList({
      ...toRaw(form),
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
      title: `${title}目录`,
      props: {
        formInline: {
          name: row?.name ?? "",
          slug: row?.slug ?? "",
          sortOrder: row?.sortOrder ?? 0,
          status: row?.status ?? 1
        }
      },
      width: "46%",
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
              await createBlogCategory(curData);
            } else {
              await updateBlogCategory({ ...curData, id: row?.id });
            }
            message(`您${title}了目录${curData.name}`, { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleDelete(row) {
    await deleteBlogCategory({ id: row.id });
    message(`您删除了目录${row.name}`, { type: "success" });
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
    handleSizeChange,
    handleCurrentChange
  };
}
