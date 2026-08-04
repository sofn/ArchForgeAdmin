import { reactive } from "vue";
import type { FormRules } from "element-plus";

const formRules = reactive<FormRules>({
  categoryId: [
    { required: true, message: "请选择所属目录", trigger: "change" }
  ],
  title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
  slug: [{ required: true, message: "请输入URL标识", trigger: "blur" }],
  content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
});

export { formRules };
