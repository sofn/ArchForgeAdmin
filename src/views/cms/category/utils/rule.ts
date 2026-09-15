import { reactive } from "vue";
import type { FormRules } from "element-plus";

const formRules = reactive<FormRules>({
  name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
  slug: [{ required: true, message: "请输入URL标识", trigger: "blur" }]
});

export { formRules };
