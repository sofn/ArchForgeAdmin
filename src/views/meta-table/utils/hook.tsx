import dayjs from "dayjs";
import DataManage from "../data/index.vue";
import { message } from "@/utils/message";
import { assertOk, EnvelopeError } from "@/utils/http/envelope";
import { hasPerms } from "@/utils/auth";
import {
  getMetaTableList,
  copyMetaTable,
  deleteMetaTable,
  checkDeleteMetaTable,
  getMetaTableDetail
} from "@/api/metaTable";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import type { MetaTable } from "./types";

export function useMetaTable() {
  const form = reactive({
    keyword: ""
  });

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
      label: "创建人",
      prop: "creatorName",
      minWidth: 100
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        createTime ? dayjs(createTime).format("YYYY-MM-DD HH:mm:ss") : ""
    },
    {
      label: "修改人",
      prop: "updaterName",
      minWidth: 100
    },
    {
      label: "修改时间",
      prop: "updateTime",
      minWidth: 160,
      formatter: ({ updateTime }) =>
        updateTime ? dayjs(updateTime).format("YYYY-MM-DD HH:mm:ss") : ""
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

  const router = useRouter();

  async function openTableTab(title = "新增", row?: MetaTable) {
    const query: Record<string, string> = {};
    if (title === "修改" && row?.id) {
      query.id = String(row.id);
    }

    const path = "/meta-table/design";
    useMultiTagsStoreHook().handleTags("push", {
      path,
      name: "MetaTableDesign",
      query,
      meta: {
        title: `${title}：${row?.tableName ?? "元表格"}`,
        dynamicLevel: 5
      }
    });
    router.push({ name: "MetaTableDesign", query });
  }

  async function handleCopy(row: MetaTable) {
    try {
      const { data } = await assertOk(copyMetaTable(row.id));
      message(`已复制元表格"${row.tableName}"，新表格ID：${data}`, {
        type: "success"
      });
      await onSearch();
    } catch (e) {
      if (e instanceof EnvelopeError) message(e.message, { type: "error" });
    }
  }

  async function handleDelete(row: MetaTable) {
    try {
      const { data } = await assertOk(checkDeleteMetaTable(row.id));
      if (data > 0) {
        if (
          !confirm(
            `该表格中仍存在 ${data} 条数据，强制删除将不可恢复，是否继续？`
          )
        ) {
          return;
        }
        await assertOk(deleteMetaTable(row.id, true));
      } else {
        await assertOk(deleteMetaTable(row.id, false));
      }
      message(`您删除了元表格"${row.tableName}"`, { type: "success" });
      onSearch();
    } catch (e) {
      if (e instanceof EnvelopeError) message(e.message, { type: "error" });
    }
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
    openTableTab,
    handleCopy,
    handleDelete,
    openDataDialog,
    handleSizeChange,
    handleCurrentChange
  };
}
