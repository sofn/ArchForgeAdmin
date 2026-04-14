import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getConfigList,
  createConfig,
  updateConfig,
  deleteConfig
} from "@/api/system";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormItemProps } from "./types";
import { deviceDetection } from "@pureadmin/utils";

export function useConfig() {
  const form = reactive({
    configName: "",
    configKey: ""
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
      label: "参数ID",
      prop: "id",
      width: 80
    },
    {
      label: "参数名称",
      prop: "configName",
      minWidth: 160
    },
    {
      label: "参数键名",
      prop: "configKey",
      minWidth: 160
    },
    {
      label: "参数键值",
      prop: "configValue",
      minWidth: 160
    },
    {
      label: "系统内置",
      prop: "configType",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type={row.configType === 1 ? "" : "info"}>
          {row.configType === 1 ? "是" : "否"}
        </el-tag>
      )
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 160
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
      width: 180,
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
    const { code, data } = await getConfigList({
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

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}参数`,
      props: {
        formInline: {
          configName: row?.configName ?? "",
          configKey: row?.configKey ?? "",
          configValue: row?.configValue ?? "",
          configType: row?.configType ?? 0,
          remark: row?.remark ?? ""
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
              await createConfig(curData);
            } else {
              await updateConfig({ ...curData, id: row?.id });
            }
            message(`您${title}了参数名称为${curData.configName}的这条数据`, {
              type: "success"
            });
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleDelete(row) {
    await deleteConfig({ id: row.id });
    message(`您删除了参数名称为${row.configName}的这条数据`, {
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
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
