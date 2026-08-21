import DataForm from "../DataForm.vue";
import { message } from "@/utils/message";
import {
  getMetaDataList,
  createMetaData,
  updateMetaData,
  deleteMetaData,
  exportMetaData,
  importMetaData
} from "@/api/metaTable";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { deviceDetection } from "@pureadmin/utils";
import type { MetaColumn } from "../../utils/types";
import { useDict } from "@/utils/dict";

function defaultSearchType(column: MetaColumn): string {
  if (column.searchType) {
    return column.searchType;
  }
  if (["STRING", "TEXT", "ENUM"].includes(column.dataType)) {
    return "LIKE";
  }
  return "EXACT";
}

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
  const { dictMap, loadDict, getDictLabel } = useDict();

  const searchColumns = allColumns
    .filter(c => c.searchable)
    .map(c => ({
      ...c,
      searchType: defaultSearchType(c)
    }));

  searchColumns.forEach(c => {
    if (c.searchType === "RANGE") {
      filters[c.columnCode] = { start: "", end: "" };
    }
  });

  const tableColumns: TableColumnList = columns.map(c => {
    if (c.dataType === "ENUM" && c.dictCode) {
      loadDict(c.dictCode);
      return {
        label: c.columnName,
        prop: c.columnCode,
        minWidth: 140,
        formatter: (row: any) => getDictLabel(c.dictCode, row[c.columnCode])
      };
    }
    if (c.dataType === "REFERENCE") {
      return {
        label: c.columnName,
        prop: c.columnCode,
        minWidth: 140,
        formatter: (row: any) =>
          row[`${c.columnCode}_display`] ?? row[c.columnCode]
      };
    }
    return {
      label: c.columnName,
      prop: c.columnCode,
      minWidth: 140
    };
  });
  tableColumns.push(
    {
      label: "创建时间",
      prop: "create_time",
      minWidth: 160,
      formatter: ({ create_time }) => create_time || ""
    },
    {
      label: "修改时间",
      prop: "update_time",
      minWidth: 160,
      formatter: ({ update_time }) => update_time || ""
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  );

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
    Object.keys(filters).forEach(k => {
      filters[k] =
        searchColumns.find(c => c.columnCode === k)?.searchType === "RANGE"
          ? { start: "", end: "" }
          : "";
    });
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

  const exportFormatOptions = [
    { label: "Excel", value: "EXCEL" },
    { label: "CSV", value: "CSV" },
    { label: "JSON", value: "JSON" }
  ];

  async function handleExport(format = "EXCEL") {
    const res = await exportMetaData(tableId, format);
    const typeMap = {
      EXCEL:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      CSV: "text/csv",
      JSON: "application/json"
    };
    const suffixMap = { EXCEL: ".xlsx", CSV: ".csv", JSON: ".json" };
    const blob = new Blob([res as any], {
      type: typeMap[format] || typeMap.EXCEL
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tableName}${suffixMap[format] || ".xlsx"}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function handleImport(format = "CSV") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = format === "CSV" ? ".csv" : ".json";
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const res = await importMetaData(tableId, file, format);
      if (res.code === 0) {
        const data = res.data as {
          total: number;
          success: number;
          failed: number;
          errors: string[];
        };
        message(
          `导入完成：共 ${data.total} 行，成功 ${data.success} 行，失败 ${data.failed} 行`,
          {
            type: data.failed > 0 ? "warning" : "success"
          }
        );
        if (data.errors?.length) {
          console.warn("导入错误详情：", data.errors);
        }
        onSearch();
      } else {
        message(res.message || "导入失败", { type: "error" });
      }
    };
    input.click();
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
    dictMap,
    exportFormatOptions,
    onSearch,
    resetForm,
    openDataForm,
    handleDeleteData,
    handleExport,
    handleImport,
    handleSizeChange,
    handleCurrentChange
  };
}
