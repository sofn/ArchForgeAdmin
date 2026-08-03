<script setup lang="ts">
import { ref, computed } from "vue";
import type { DataFormProps } from "../utils/types";

const props = defineProps({
  formInline: {
    type: Object as PropType<DataFormProps["formInline"]>,
    default: () => ({})
  },
  columns: {
    type: Array as PropType<DataFormProps["columns"]>,
    default: () => []
  }
});

const ruleFormRef = ref();
const newFormInline = ref<Record<string, any>>(props.formInline);

const visibleColumns = computed(() =>
  props.columns.filter(c => c.columnCode !== "id")
);

function getRef() {
  return ruleFormRef.value;
}

const textTypes = ["STRING", "TEXT", "JSON", "FILE"];
const numberTypes = ["INTEGER", "DECIMAL"];

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" label-width="120px">
    <el-form-item
      v-for="column in visibleColumns"
      :key="column.columnCode"
      :label="column.columnName"
      :prop="column.columnCode"
      :required="column.required"
    >
      <el-input
        v-if="textTypes.includes(column.dataType)"
        v-model="newFormInline[column.columnCode]"
        :placeholder="`请输入${column.columnName}`"
        clearable
        class="w-full!"
      />
      <el-input-number
        v-else-if="numberTypes.includes(column.dataType)"
        v-model="newFormInline[column.columnCode]"
        :placeholder="`请输入${column.columnName}`"
        controls-position="right"
        class="w-full!"
      />
      <el-switch
        v-else-if="column.dataType === 'BOOLEAN'"
        v-model="newFormInline[column.columnCode]"
        active-value="true"
        inactive-value="false"
      />
      <el-date-picker
        v-else-if="column.dataType === 'DATE'"
        v-model="newFormInline[column.columnCode]"
        type="date"
        value-format="YYYY-MM-DD"
        :placeholder="`请选择${column.columnName}`"
        class="w-full!"
      />
      <el-date-picker
        v-else-if="column.dataType === 'DATETIME'"
        v-model="newFormInline[column.columnCode]"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        :placeholder="`请选择${column.columnName}`"
        class="w-full!"
      />
      <el-select
        v-else-if="column.dataType === 'ENUM'"
        v-model="newFormInline[column.columnCode]"
        :placeholder="`请选择${column.columnName}`"
        clearable
        class="w-full!"
      >
        <el-option
          v-for="opt in column.options"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
