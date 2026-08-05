<script setup lang="ts">
import { ref, computed } from "vue";
import { message } from "@/utils/message";
import type { DataFormProps, MetaColumn } from "../utils/types";

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

const auditColumns = [
  "id",
  "creator_id",
  "create_time",
  "updater_id",
  "update_time",
  "deleted"
];

const visibleColumns = computed(() =>
  props.columns.filter(c => !auditColumns.includes(c.columnCode))
);

const textTypes = ["STRING", "TEXT", "UUID"];
const numberTypes = ["INTEGER", "DECIMAL"];
const fileTypes = ["FILE", "IMAGE"];

const uploadUrl = "/api/file/upload";

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

function fileListFor(column: MetaColumn) {
  let value = newFormInline.value[column.columnCode];
  if (column.dataType === "MULTI_IMAGE") {
    if (typeof value === "string" && value) {
      try {
        value = JSON.parse(value);
        newFormInline.value[column.columnCode] = value;
      } catch {
        value = [];
      }
    }
    const ids = Array.isArray(value) ? value : [];
    return ids.map((id, idx) => ({
      name: `图片${idx + 1}`,
      url: downloadUrl(id),
      uid: id + idx
    }));
  }
  if (value) {
    return [
      { name: column.columnName, url: downloadUrl(value), uid: Number(value) }
    ];
  }
  return [];
}

function downloadUrl(fileId: number) {
  return `/api/file/download/${fileId}`;
}

function beforeUpload(column: MetaColumn, file: File) {
  const maxSize = column.length || 10 * 1024 * 1024;
  if (file.size > maxSize) {
    message(`文件大小不能超过 ${maxSize} 字节`, { type: "error" });
    return false;
  }
  return true;
}

function handleUploadSuccess(column: MetaColumn, res: any) {
  if (res?.code === 0 && res?.data?.fileId) {
    newFormInline.value[column.columnCode] = res.data.fileId;
  }
}

function handleMultiUploadSuccess(column: MetaColumn, res: any) {
  if (res?.code === 0 && res?.data?.fileId) {
    if (!Array.isArray(newFormInline.value[column.columnCode])) {
      newFormInline.value[column.columnCode] = [];
    }
    newFormInline.value[column.columnCode].push(res.data.fileId);
  }
}

function handleMultiRemove(column: MetaColumn, file: any) {
  const value = newFormInline.value[column.columnCode];
  if (!Array.isArray(value)) return;
  const fileId = extractFileId(file.url);
  const index = value.indexOf(fileId);
  if (index > -1) {
    value.splice(index, 1);
  }
}

function extractFileId(url: string) {
  const match = url.match(/\/file\/download\/(\d+)$/);
  return match ? Number(match[1]) : 0;
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
      <el-upload
        v-if="fileTypes.includes(column.dataType)"
        :file-list="fileListFor(column)"
        :action="uploadUrl"
        :limit="1"
        :before-upload="file => beforeUpload(column, file as File)"
        :on-success="(res: any) => handleUploadSuccess(column, res)"
      >
        <el-button type="primary">上传{{ column.columnName }}</el-button>
      </el-upload>
      <el-upload
        v-else-if="column.dataType === 'MULTI_IMAGE'"
        :file-list="fileListFor(column)"
        :action="uploadUrl"
        list-type="picture-card"
        multiple
        :before-upload="file => beforeUpload(column, file as File)"
        :on-success="(res: any) => handleMultiUploadSuccess(column, res)"
        :on-remove="(file: any) => handleMultiRemove(column, file)"
      >
        <span class="text-2xl">+</span>
      </el-upload>
      <el-input
        v-else-if="textTypes.includes(column.dataType)"
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
