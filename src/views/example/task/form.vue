<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import type { FormProps } from "./utils/types";

const props = defineProps({
  formInline: {
    type: Object as PropType<FormProps["formInline"]>,
    default: () => ({
      id: undefined,
      title: "",
      description: "",
      uid: undefined
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
    <el-form-item label="任务标题" prop="title">
      <el-input v-model="newFormInline.title" placeholder="请输入任务标题" />
    </el-form-item>
    <el-form-item label="任务描述" prop="description">
      <el-input
        v-model="newFormInline.description"
        type="textarea"
        :rows="4"
        placeholder="请输入任务描述"
      />
    </el-form-item>
    <el-form-item label="负责人" prop="uid">
      <el-input-number
        v-model="newFormInline.uid"
        :min="1"
        placeholder="负责人UID"
        class="w-full!"
      />
    </el-form-item>
  </el-form>
</template>
