import dayjs from "dayjs";
import TableForm from "../form/TableForm.vue";
import DataManage from "../data/index.vue";
import { message } from "@/utils/message";
import { hasPerms } from "@/utils/auth";
import {
  getMetaTableList,
  createMetaTable,
  updateMetaTable,
  copyMetaTable,
  deleteMetaTable,
  checkDeleteMetaTable,
  getMetaTableDetail
} from "@/api/metaTable";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { MetaTable } from "./types";
import { deviceDetection } from "@pureadmin/utils";

export function useMetaTable() {
  const form = reactive({
    keyword: ""
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
      label: "ID",
      prop: "id",
      width: 80
    },
    {
      label: "表格编码",
      prop: "tableCode",
      minWidth: 140
    },
    {
      label: "表格名称",
      prop: "tableName",
      minWidth: 160
    },
    {
      label: "描述",
      prop: "description",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "状态",
      prop: "status",
      width: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type={row.status === 1 ? "success" : "info"}>
          {row.status === 1 ? "启用" : "禁用"}
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
    {
      label: "操作",
      fixed: "right",
      width: 360,
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

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { code, data } = await getMetaTableList({
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

  function openTableDialog(title = "新增", row?: MetaTable) {
    addDialog({
      title: `${title}元表格`,
      props: {
        formInline: {
          id: row?.id ?? undefined,
          tableCode: row?.tableCode ?? "",
          tableName: row?.tableName ?? "",
          description: row?.description ?? "",
          tablePrefix: row?.tablePrefix ?? "meta_",
          status: row?.status ?? 1,
          columns: title === "新增" ? [] : (row?.columns ?? [])
        }
      },
      width: "70%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(TableForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as MetaTable;
        FormRef.validate(async valid => {
          if (valid) {
            if (!curData.columns || curData.columns.length === 0) {
              message("请至少配置一个字段", { type: "warning" });
              return;
            }
            if (title === "新增") {
              await createMetaTable(curData);
              message(`您新增了元表格"${curData.tableName}"`, {
                type: "success"
              });
            } else {
              await updateMetaTable(curData.id, {
                tableName: curData.tableName,
                description: curData.description,
                status: curData.status
              });
              message(`您修改了元表格"${curData.tableName}"`, {
                type: "success"
              });
            }
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleCopy(row: MetaTable) {
    const { code, data } = await copyMetaTable(row.id);
    if (code === 0) {
      message(`已复制元表格"${row.tableName}"，新表格ID：${data}`, {
        type: "success"
      });
      onSearch();
    }
  }

  async function handleDelete(row: MetaTable) {
    const { code, data } = await checkDeleteMetaTable(row.id);
    if (code === 0 && data > 0) {
      if (
        !confirm(
          `该表格中仍存在 ${data} 条数据，强制删除将不可恢复，是否继续？`
        )
      ) {
        return;
      }
      await deleteMetaTable(row.id, true);
    } else {
      await deleteMetaTable(row.id, false);
    }
    message(`您删除了元表格"${row.tableName}"`, { type: "success" });
    onSearch();
  }

  async function openDataDialog(row: MetaTable) {
    const detail = await getMetaTableDetail(row.id);
    if (detail.code !== 0) return;
    const table = detail.data as MetaTable;
    const visibleColumns = (table.columns ?? []).filter(c => c.listVisible);

    addDialog({
      title: `"${table.tableName}" 数据管理`,
      width: "90%",
      draggable: true,
      fullscreen: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () =>
        h(DataManage, {
          tableId: row.id,
          tableName: table.tableName,
          columns: visibleColumns,
          allColumns: table.columns ?? []
        })
    });
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
    openTableDialog,
    handleCopy,
    handleDelete,
    openDataDialog,
    handleSizeChange,
    handleCurrentChange
  };
}
