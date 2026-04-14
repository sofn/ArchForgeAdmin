<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import type { FormProps } from "./utils/types";

const props = defineProps({
  formInline: {
    type: Object as PropType<FormProps["formInline"]>,
    default: () => ({
      noticeTitle: "",
      noticeType: 1,
      noticeContent: "",
      status: 1,
      remark: ""
    })
  }
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-form-item label="公告标题" prop="noticeTitle">
      <el-input
        v-model="newFormInline.noticeTitle"
        placeholder="请输入公告标题"
      />
    </el-form-item>
    <el-form-item label="公告类型" prop="noticeType">
      <el-select
        v-model="newFormInline.noticeType"
        placeholder="请选择公告类型"
      >
        <el-option label="通知" :value="1" />
        <el-option label="公告" :value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio :value="1">正常</el-radio>
        <el-radio :value="0">关闭</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="公告内容" prop="noticeContent">
      <el-input
        v-model="newFormInline.noticeContent"
        type="textarea"
        :rows="5"
        placeholder="请输入公告内容"
      />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        :rows="2"
        placeholder="请输入备注"
      />
    </el-form-item>
  </el-form>
</template>
