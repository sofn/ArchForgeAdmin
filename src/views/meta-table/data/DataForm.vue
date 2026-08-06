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

const textTypes = ["STRING", "TEXT", "FILE", "UUID"];
const numberTypes = ["INTEGER", "DECIMAL", "REFERENCE"];

function getRef() {
  return ruleFormRef.value;
}

function getData() {
  const result = { ...newFormInline.value };
  visibleColumns.value.forEach(column => {
    if (column.dataType === "GEO" && result[column.columnCode]) {
      result[column.columnCode] = JSON.stringify(result[column.columnCode]);
    }
  });
  return result;
}

function geoModel(columnCode: string) {
  if (!newFormInline.value[columnCode]) {
    newFormInline.value[columnCode] = { lat: null, lng: null };
  }
  if (typeof newFormInline.value[columnCode] === "string") {
    try {
      newFormInline.value[columnCode] = JSON.parse(
        newFormInline.value[columnCode]
      );
    } catch {
      newFormInline.value[columnCode] = { lat: null, lng: null };
    }
  }
  return newFormInline.value[columnCode] as {
    lat?: number | null;
    lng?: number | null;
  };
}

defineExpose({ getRef, getData });
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
      <el-input
        v-else-if="column.dataType === 'JSON'"
        v-model="newFormInline[column.columnCode]"
        type="textarea"
        :placeholder="`请输入${column.columnName}，示例：{&quot;key&quot;:&quot;value&quot;}`"
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
        :active-value="true"
        :inactive-value="false"
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
      <el-date-picker
        v-else-if="column.dataType === 'TIMESTAMPTZ'"
        v-model="newFormInline[column.columnCode]"
        type="datetime"
        value-format="YYYY-MM-DDTHH:mm:ssZ"
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
      <el-select
        v-else-if="column.dataType === 'ARRAY'"
        v-model="newFormInline[column.columnCode]"
        multiple
        filterable
        allow-create
        default-first-option
        :placeholder="`请输入${column.columnName}，按回车确认`"
        class="w-full!"
      />
      <div v-else-if="column.dataType === 'GEO'" class="flex gap-2 w-full">
        <el-input-number
          v-model="geoModel(column.columnCode).lat"
          placeholder="纬度"
          controls-position="right"
          class="flex-1"
        />
        <el-input-number
          v-model="geoModel(column.columnCode).lng"
          placeholder="经度"
          controls-position="right"
          class="flex-1"
        />
      </div>
    </el-form-item>
  </el-form>
</template>
