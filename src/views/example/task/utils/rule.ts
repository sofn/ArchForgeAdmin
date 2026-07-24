import { reactive } from "vue";
import type { FormRules } from "element-plus";

const formRules = reactive<FormRules>({
  title: [{ required: true, message: "请输入任务标题", trigger: "blur" }]
});

export { formRules };
