import { reactive } from "vue";
import type { FormRules } from "element-plus";

const tableCodePattern = /^[a-z][a-z0-9_]{0,62}$/;
const columnCodePattern = /^[a-z][a-z0-9_]{0,62}$/;

export const tableRules = reactive<FormRules>({
  tableCode: [
    { required: true, message: "请输入表格编码", trigger: "blur" },
    {
      pattern: tableCodePattern,
      message: "只能为小写字母、数字、下划线，且不能以数字开头",
      trigger: "blur"
    }
  ],
  tableName: [{ required: true, message: "请输入表格名称", trigger: "blur" }]
});

export const fieldRules = reactive<FormRules>({
  columnCode: [
    { required: true, message: "请输入字段编码", trigger: "blur" },
    {
      pattern: columnCodePattern,
      message: "只能为小写字母、数字、下划线，且不能以数字开头",
      trigger: "blur"
    }
  ],
  columnName: [{ required: true, message: "请输入字段名称", trigger: "blur" }],
  dataType: [{ required: true, message: "请选择字段类型", trigger: "change" }]
});
