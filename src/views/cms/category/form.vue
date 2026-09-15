<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import type { FormProps } from "./utils/types";

const props = defineProps({
  formInline: {
    type: Object as PropType<FormProps["formInline"]>,
    default: () => ({
      name: "",
      slug: "",
      sortOrder: 0,
      status: 1
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
    <el-form-item label="分类名称" prop="name">
      <el-input v-model="newFormInline.name" placeholder="请输入分类名称" />
    </el-form-item>
    <el-form-item label="URL标识" prop="slug">
      <el-input v-model="newFormInline.slug" placeholder="英文、数字、中划线" />
    </el-form-item>
    <el-form-item label="排序" prop="sortOrder">
      <el-input-number v-model="newFormInline.sortOrder" :min="0" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio :value="1">显示</el-radio>
        <el-radio :value="0">隐藏</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
