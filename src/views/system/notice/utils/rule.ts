import { reactive } from "vue";
import type { FormRules } from "element-plus";

const formRules = reactive<FormRules>({
  noticeTitle: [{ required: true, message: "请输入公告标题", trigger: "blur" }],
  noticeType: [{ required: true, message: "请选择公告类型", trigger: "change" }]
});

export { formRules };
