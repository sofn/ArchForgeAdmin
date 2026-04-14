import { reactive } from "vue";
import type { FormRules } from "element-plus";

const formRules = reactive<FormRules>({
  configName: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
  configKey: [{ required: true, message: "请输入参数键名", trigger: "blur" }],
  configValue: [{ required: true, message: "请输入参数键值", trigger: "blur" }]
});

export { formRules };
