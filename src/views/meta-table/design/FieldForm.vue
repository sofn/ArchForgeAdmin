<script setup lang="ts">
import { ref, watch } from "vue";
import { fieldRules } from "../utils/rule";
import type { FieldFormProps, OptionItem } from "../utils/types";

const props = defineProps({
  formInline: {
    type: Object as PropType<FieldFormProps["formInline"]>,
    default: () => ({
      columnCode: "",
      columnName: "",
      dataType: "STRING",
      length: undefined,
      precision: undefined,
      scale: undefined,
      nullable: true,
      defaultValue: "",
      unique: false,
      required: false,
      searchable: true,
      listVisible: true,
      index: false,
      indexType: undefined,
      indexGroup: undefined,
      sort: 0,
      options: [],
      arrayElementType: undefined,
      searchType: "LIKE"
    })
  }
});

const ruleFormRef = ref();
const newFormInline = ref<FieldFormProps["formInline"]>(props.formInline);

const dataTypeOptions = [
  { label: "文本", value: "STRING" },
  { label: "长文本", value: "TEXT" },
  { label: "整数", value: "INTEGER" },
  { label: "小数", value: "DECIMAL" },
  { label: "布尔", value: "BOOLEAN" },
  { label: "日期", value: "DATE" },
  { label: "日期时间", value: "DATETIME" },
  { label: "时间戳(带时区)", value: "TIMESTAMPTZ" },
  { label: "UUID", value: "UUID" },
  { label: "枚举", value: "ENUM" },
  { label: "JSON", value: "JSON" },
  { label: "数组", value: "ARRAY" },
  { label: "地理位置", value: "GEO" },
  { label: "文件", value: "FILE" },
  { label: "图片", value: "IMAGE" },
  { label: "多图片", value: "MULTI_IMAGE" }
];

const arrayElementTypeOptions = [
  { label: "文本", value: "STRING" },
  { label: "整数", value: "INTEGER" },
  { label: "小数", value: "DECIMAL" },
  { label: "布尔", value: "BOOLEAN" }
];

const indexTypeOptions = [
  { label: "BTREE", value: "BTREE" },
  { label: "GIN", value: "GIN" },
  { label: "GIST", value: "GIST" },
  { label: "全文", value: "FULLTEXT" }
];

const fileTypes = ["FILE", "IMAGE", "MULTI_IMAGE"];
const showLength = ["STRING", ...fileTypes];
const showPrecision = ["DECIMAL"];
const showEnum = ["ENUM"];
const showArrayElement = ["ARRAY"];
const showIndexConfig = [
  "STRING",
  "TEXT",
  "INTEGER",
  "DECIMAL",
  "DATE",
  "DATETIME",
  "TIMESTAMPTZ",
  "UUID",
  "JSON",
  "ARRAY",
  "GEO",
  ...fileTypes
];
const showSearchType = [
  "STRING",
  "TEXT",
  "INTEGER",
  "DECIMAL",
  "DATE",
  "DATETIME",
  "TIMESTAMPTZ",
  "ENUM"
];

function isFileType(type: string) {
  return fileTypes.includes(type);
}

function searchTypeOptions(type: string) {
  if (
    ["INTEGER", "DECIMAL", "DATE", "DATETIME", "TIMESTAMPTZ"].includes(type)
  ) {
    return [
      { label: "精确匹配", value: "EXACT" },
      { label: "范围搜索", value: "RANGE" }
    ];
  }
  return [
    { label: "精确匹配", value: "EXACT" },
    { label: "模糊搜索", value: "LIKE" }
  ];
}

function lengthLabel(type: string) {
  return isFileType(type) ? "文件大小限制(B)" : "长度";
}

function lengthMax(type: string) {
  return isFileType(type) ? 100 * 1024 * 1024 : 4000;
}

function getRef() {
  return ruleFormRef.value;
}

watch(
  () => newFormInline.value.dataType,
  type => {
    const options = searchTypeOptions(type);
    const defaultType = options[0].value;
    if (
      !newFormInline.value.searchType ||
      !options.some(o => o.value === newFormInline.value.searchType)
    ) {
      newFormInline.value.searchType = defaultType;
    }
  },
  { immediate: true }
);

function addOption() {
  const options = newFormInline.value.options ?? [];
  options.push({ label: "", value: "" });
  newFormInline.value.options = [...options];
}

function removeOption(index: number) {
  const options = newFormInline.value.options ?? [];
  options.splice(index, 1);
  newFormInline.value.options = [...options];
}

function defaultValuePlaceholder() {
  const type = newFormInline.value.dataType;
  if (type === "ARRAY") {
    return '示例：["a","b"] 或 1,2,3';
  }
  if (type === "GEO") {
    return '示例：{"lat":31.23,"lng":121.47}';
  }
  if (type === "JSON") {
    return '示例：{"key":"value"}';
  }
  return "请输入默认值";
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="fieldRules"
    label-width="100px"
  >
    <el-form-item label="字段编码" prop="columnCode">
      <el-input
        v-model="newFormInline.columnCode"
        placeholder="小写字母、数字、下划线"
      />
    </el-form-item>
    <el-form-item label="字段名称" prop="columnName">
      <el-input
        v-model="newFormInline.columnName"
        placeholder="请输入字段名称"
      />
    </el-form-item>
    <el-form-item label="字段类型" prop="dataType">
      <el-select v-model="newFormInline.dataType" class="w-full!">
        <el-option
          v-for="item in dataTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="showLength.includes(newFormInline.dataType)"
      :label="lengthLabel(newFormInline.dataType)"
      prop="length"
    >
      <el-input-number
        v-model="newFormInline.length"
        :min="1"
        :max="lengthMax(newFormInline.dataType)"
        class="w-full!"
      />
    </el-form-item>
    <template v-if="showPrecision.includes(newFormInline.dataType)">
      <el-form-item label="精度" prop="precision">
        <el-input-number
          v-model="newFormInline.precision"
          :min="1"
          class="w-full!"
        />
      </el-form-item>
      <el-form-item label="小数位" prop="scale">
        <el-input-number
          v-model="newFormInline.scale"
          :min="0"
          class="w-full!"
        />
      </el-form-item>
    </template>
    <el-form-item
      v-if="showArrayElement.includes(newFormInline.dataType)"
      label="元素类型"
      prop="arrayElementType"
    >
      <el-select v-model="newFormInline.arrayElementType" class="w-full!">
        <el-option
          v-for="item in arrayElementTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="默认值" prop="defaultValue">
      <el-input
        v-model="newFormInline.defaultValue"
        :placeholder="defaultValuePlaceholder()"
      />
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input-number v-model="newFormInline.sort" :min="0" class="w-full!" />
    </el-form-item>
    <el-form-item
      v-if="showEnum.includes(newFormInline.dataType)"
      label="枚举选项"
    >
      <div class="w-full">
        <div
          v-for="(opt, idx) in newFormInline.options"
          :key="idx"
          class="flex gap-2 mb-2"
        >
          <el-input v-model="opt.label" placeholder="显示值" />
          <el-input v-model="opt.value" placeholder="实际值" />
          <el-button type="danger" @click="removeOption(idx)">删除</el-button>
        </div>
        <el-button type="primary" @click="addOption">新增选项</el-button>
      </div>
    </el-form-item>
    <el-form-item label="约束">
      <el-checkbox v-model="newFormInline.required">必填</el-checkbox>
      <el-checkbox v-model="newFormInline.unique">唯一</el-checkbox>
      <el-checkbox v-model="newFormInline.index">索引</el-checkbox>
    </el-form-item>
    <template
      v-if="
        newFormInline.index && showIndexConfig.includes(newFormInline.dataType)
      "
    >
      <el-form-item label="索引类型">
        <el-select
          v-model="newFormInline.indexType"
          class="w-full!"
          placeholder="默认 BTREE"
        >
          <el-option
            v-for="item in indexTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="索引分组">
        <el-input
          v-model="newFormInline.indexGroup"
          placeholder="相同分组组成复合索引，留空为单列索引"
        />
      </el-form-item>
    </template>
    <el-form-item
      v-if="showSearchType.includes(newFormInline.dataType)"
      label="搜索方式"
    >
      <el-select v-model="newFormInline.searchType" class="w-full!">
        <el-option
          v-for="item in searchTypeOptions(newFormInline.dataType)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="其他">
      <el-checkbox v-model="newFormInline.searchable">可搜索</el-checkbox>
      <el-checkbox v-model="newFormInline.listVisible">列表显示</el-checkbox>
    </el-form-item>
  </el-form>
</template>
