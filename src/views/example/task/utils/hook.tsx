import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { hasPerms } from "@/utils/auth";
import {
  getTaskList,
  createTask,
  updateTask,
  deleteTask,
  startTask,
  completeTask,
  cancelTask
} from "@/api/task";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormItemProps } from "./types";
import { deviceDetection } from "@pureadmin/utils";

const statusMap: Record<string, { label: string; type: any }> = {
  CREATED: { label: "待处理", type: "info" },
  IN_PROGRESS: { label: "进行中", type: "primary" },
  COMPLETED: { label: "已完成", type: "success" },
  CANCELLED: { label: "已取消", type: "danger" }
};

export function useTask() {
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
    {
      label: "任务ID",
      prop: "id",
      width: 80
    },
    {
      label: "任务标题",
      prop: "title",
      minWidth: 160
    },
    {
      label: "任务描述",
      prop: "description",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      cellRenderer: ({ row, props }) => {
        const config = statusMap[row.status] ?? { label: row.status, type: "" };
        return (
          <el-tag size={props.size} type={config.type}>
            {config.label}
          </el-tag>
        );
      }
    },
    {
      label: "负责人",
      prop: "uid",
      width: 100
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        createTime ? dayjs(createTime).format("YYYY-MM-DD HH:mm:ss") : ""
    },
    {
      label: "操作",
      fixed: "right",
      width: 280,
      slot: "operation"
    }
  ];

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { code, data } = await getTaskList({
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
    setTimeout(() => {
      loading.value = false;
    }, 300);
  }

  async function handleAction(
    fn: (data: any) => Promise<any>,
    row: any,
    successText: string
  ) {
    const { code } = await fn({ id: row.id });
    if (code === 0) {
      message(successText, { type: "success" });
      onSearch();
    }
  }

  function handleStart(row: FormItemProps) {
    handleAction(startTask, row, `您开始了任务"${row.title}"`);
  }

  function handleComplete(row: FormItemProps) {
    handleAction(completeTask, row, `您完成了任务"${row.title}"`);
  }

  function handleCancel(row: FormItemProps) {
    handleAction(cancelTask, row, `您取消了任务"${row.title}"`);
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}任务`,
      props: {
        formInline: {
          id: row?.id ?? undefined,
          title: row?.title ?? "",
          description: row?.description ?? "",
          uid: row?.uid ?? undefined
        }
      },
      width: "50%",
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
              await createTask(curData);
            } else {
              await updateTask(curData);
            }
            message(`您${title}了任务标题为${curData.title}的这条数据`, {
              type: "success"
            });
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleDelete(row: FormItemProps) {
    await deleteTask({ id: row.id });
    message(`您删除了任务标题为${row.title}的这条数据`, {
      type: "success"
    });
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    hasPerms,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleStart,
    handleComplete,
    handleCancel,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
