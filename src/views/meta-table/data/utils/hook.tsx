import DataForm from "../DataForm.vue";
import { message } from "@/utils/message";
import {
  getMetaDataList,
  createMetaData,
  updateMetaData,
  deleteMetaData,
  exportMetaData
} from "@/api/metaTable";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { deviceDetection } from "@pureadmin/utils";
import type { MetaColumn } from "../../utils/types";

export function useMetaData(
  tableId: number,
  tableName: string,
  columns: MetaColumn[],
  allColumns: MetaColumn[]
) {
  const filters = reactive<Record<string, any>>({});
  const dataList = ref([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const formRef = ref();

  const searchColumns = allColumns.filter(c => c.searchable);

  const tableColumns: TableColumnList = columns.map(c => ({
    label: c.columnName,
    prop: c.columnCode,
    minWidth: 140
  }));
  tableColumns.push({
    label: "操作",
    fixed: "right",
    width: 180,
    slot: "operation"
  });

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
    Object.keys(filters).forEach(k => (filters[k] = ""));
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { code, data } = await getMetaDataList(tableId, {
      filters: toRaw(filters),
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

  function openDataForm(title = "新增", row?: any) {
    addDialog({
      title: `${title}数据`,
      props: {
        formInline: title === "新增" ? {} : { ...row },
        columns: allColumns
      },
      width: "50%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(DataForm, { ref: formRef, formInline: null, columns: null }),
      beforeSure: done => {
        const FormRef = formRef.value.getRef();
        const curData = formRef.value.getData() as Record<string, any>;
        FormRef.validate(async valid => {
          if (valid) {
            if (title === "新增") {
              await createMetaData(tableId, curData);
              message("数据新增成功", { type: "success" });
            } else {
              await updateMetaData(tableId, row.id, curData);
              message("数据修改成功", { type: "success" });
            }
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleDeleteData(row: any) {
    await deleteMetaData(tableId, row.id);
    message("数据删除成功", { type: "success" });
    onSearch();
  }

  async function handleExport() {
    const res = await exportMetaData(tableId);
    const blob = new Blob([res as any], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tableName}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    filters,
    loading,
    dataList,
    pagination,
    searchColumns,
    tableColumns,
    onSearch,
    resetForm,
    openDataForm,
    handleDeleteData,
    handleExport,
    handleSizeChange,
    handleCurrentChange
  };
}
