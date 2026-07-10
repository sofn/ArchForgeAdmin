import dayjs from "dayjs";
import { message } from "@/utils/message";
import { getFileList, deleteFile, downloadFile } from "@/api/file";
import { ElMessageBox } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, toRaw } from "vue";

export function useFile() {
  const form = reactive({
    originalName: "",
    storageType: ""
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

  const storageTypeOptions = [
    { label: "全部", value: "" },
    { label: "本地", value: "local" },
    { label: "S3", value: "s3" }
  ];

  const columns: TableColumnList = [
    {
      label: "文件ID",
      prop: "id",
      width: 80
    },
    {
      label: "原始文件名",
      prop: "originalName",
      minWidth: 180
    },
    {
      label: "存储类型",
      prop: "storageType",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.storageType === "s3" ? "success" : "info"}
        >
          {row.storageType === "s3" ? "S3" : "本地"}
        </el-tag>
      )
    },
    {
      label: "大小",
      prop: "fileSize",
      width: 120,
      formatter: ({ fileSize }) => formatBytes(fileSize)
    },
    {
      label: "MIME类型",
      prop: "contentType",
      minWidth: 160
    },
    {
      label: "上传时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        createTime ? dayjs(createTime).format("YYYY-MM-DD HH:mm:ss") : ""
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  function formatBytes(bytes: number) {
    if (bytes === 0 || bytes == null) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

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
    const { code, data } = await getFileList({
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

  async function handleDownload(row) {
    const blob = await downloadFile(row.id);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = row.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleDelete(row) {
    await ElMessageBox.confirm(
      `确认要删除文件 <strong>${row.originalName}</strong> 吗？`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    );
    const { code } = await deleteFile({ id: row.id });
    if (code === 0) {
      message(`已删除 ${row.originalName}`, { type: "success" });
      onSearch();
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    formRef,
    loading,
    columns,
    dataList,
    pagination,
    storageTypeOptions,
    onSearch,
    resetForm,
    handleDelete,
    handleDownload,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
