<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import type { FormProps } from "./utils/types";

const props = defineProps({
  formInline: {
    type: Object as PropType<FormProps["formInline"]>,
    default: () => ({
      configName: "",
      configKey: "",
      configValue: "",
      configType: 0,
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
    <el-form-item label="参数名称" prop="configName">
      <el-input
        v-model="newFormInline.configName"
        placeholder="请输入参数名称"
      />
    </el-form-item>
    <el-form-item label="参数键名" prop="configKey">
      <el-input
        v-model="newFormInline.configKey"
        placeholder="请输入参数键名"
      />
    </el-form-item>
    <el-form-item label="参数键值" prop="configValue">
      <el-input
        v-model="newFormInline.configValue"
        placeholder="请输入参数键值"
      />
    </el-form-item>
    <el-form-item label="系统内置" prop="configType">
      <el-radio-group v-model="newFormInline.configType">
        <el-radio :value="1">是</el-radio>
        <el-radio :value="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        :rows="3"
        placeholder="请输入备注"
      />
    </el-form-item>
  </el-form>
</template>
