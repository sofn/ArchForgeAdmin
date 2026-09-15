<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { fieldRules } from "../utils/rule";
import type { FieldFormProps } from "../utils/types";
import type { Schema } from "@/types/contract";
import { getDictTypePage } from "@/api/dict";
import type { DictType } from "@/api/dict";
import { getMetaTableList, getMetaTableDetail } from "@/api/metaTable";

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
      dictCode: undefined,
      arrayElementType: undefined,
      referenceTable: undefined,
      referenceColumn: "id",
      displayExpression: undefined,
      searchType: "LIKE"
    })
  }
});

const ruleFormRef = ref();
const newFormInline = ref<FieldFormProps["formInline"]>(props.formInline);
const dictTypes = ref<DictType[]>([]);
const dictTypeLoading = ref(false);
const metaTables = ref<Schema<"MetaTableResponse">[]>([]);
const refColumnOptions = ref<string[]>([]);
const refColumnLoading = ref(false);
const advancedOpen = ref<string[]>([]);

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
  { label: "多图片", value: "MULTI_IMAGE" },
  { label: "关联", value: "REFERENCE" }
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
const showLength = ["STRING", "ENUM", ...fileTypes];
const showPrecision = ["DECIMAL"];
const showEnum = ["ENUM"];
const showArrayElement = ["ARRAY"];
const showReference = ["REFERENCE"];
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

/** 可选关联表：已有元表格，值为物理表名（tablePrefix + tableCode） */
const referenceTableOptions = computed(() =>
  metaTables.value.map(t => {
    const physical = `${t.tablePrefix || "meta_"}${t.tableCode}`;
    return { label: `${t.tableName}（${physical}）`, value: physical };
  })
);

const currentRefTable = computed(() =>
  metaTables.value.find(
    t =>
      `${t.tablePrefix || "meta_"}${t.tableCode}` ===
      newFormInline.value.referenceTable
  )
);

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
    if (type !== "ENUM") {
      newFormInline.value.dictCode = undefined;
      newFormInline.value.options = [];
    }
    const options = searchTypeOptions(type);
    const defaultType = options[0].value;
    if (
      !newFormInline.value.searchType ||
      !options.some(o => o.value === newFormInline.value.searchType)
    ) {
      newFormInline.value.searchType = defaultType;
    }
    if (type === "REFERENCE") {
      loadMetaTables();
    }
  },
  { immediate: true }
);

// 必填与允许为空默认反向联动（物理 nullable 缺省回退 !required）；
// 用户仍可在约束区单独覆盖 —— nullable 是 DDL 真源，required 只管表单校验。
watch(
  () => newFormInline.value.required,
  required => {
    newFormInline.value.nullable = !required;
  }
);

watch(
  () => newFormInline.value.referenceTable,
  () => loadRefColumns()
);

async function loadRefColumns() {
  const table = currentRefTable.value;
  refColumnOptions.value = [];
  if (!table?.id) {
    return;
  }
  refColumnLoading.value = true;
  try {
    const res = await getMetaTableDetail(table.id);
    if (res?.code === 0) {
      const cols: { columnCode?: string }[] = res.data?.columns ?? [];
      refColumnOptions.value = cols
        .map(c => c.columnCode)
        .filter((c): c is string => Boolean(c));
    }
  } finally {
    refColumnLoading.value = false;
  }
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

async function loadDictTypes() {
  dictTypeLoading.value = true;
  try {
    const res = await getDictTypePage({ currentPage: 1, pageSize: 1000 });
    if (res?.code === 0) {
      dictTypes.value = res.data?.list || [];
    }
  } finally {
    dictTypeLoading.value = false;
  }
}

async function loadMetaTables() {
  if (metaTables.value.length > 0) {
    return;
  }
  try {
    const res = await getMetaTableList({ currentPage: 1, pageSize: 1000 });
    if (res?.code === 0) {
      metaTables.value = res.data?.list || [];
      await loadRefColumns();
    }
  } catch {
    // 列表加载失败时仍允许手填物理表名（allow-create）
  }
}

onMounted(() => {
  loadDictTypes();
  if (newFormInline.value.dataType === "REFERENCE") {
    loadMetaTables();
  }
});

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="fieldRules"
    label-width="100px"
  >
    <el-divider content-position="left">基础信息</el-divider>
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

    <template v-if="showReference.includes(newFormInline.dataType)">
      <el-divider content-position="left">关联配置</el-divider>
      <el-form-item label="关联表" prop="referenceTable">
        <el-select
          v-model="newFormInline.referenceTable"
          class="w-full!"
          placeholder="选择已有元表格，或手填物理表名"
          filterable
          allow-create
          clearable
          default-first-option
        >
          <el-option
            v-for="item in referenceTableOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div v-if="currentRefTable" class="w-full text-xs text-gray-400">
          物理表名：{{ currentRefTable.tablePrefix || "meta_"
          }}{{ currentRefTable.tableCode }}
        </div>
      </el-form-item>
      <el-form-item label="关联字段" prop="referenceColumn">
        <el-select
          v-model="newFormInline.referenceColumn"
          class="w-full!"
          placeholder="默认为 id"
          filterable
          allow-create
          default-first-option
          :loading="refColumnLoading"
        >
          <el-option
            v-for="item in refColumnOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="显示表达式" prop="displayExpression">
        <el-input
          v-model="newFormInline.displayExpression"
          placeholder="例如：ref.username || ' - ' || ref.email"
        />
        <div class="w-full text-xs text-gray-400">
          ref 指代关联表行；|| 为 SQL 字符串拼接；引用字段写作 ref.列名
        </div>
      </el-form-item>
    </template>

    <el-divider content-position="left">约束与索引</el-divider>
    <el-form-item label="约束">
      <el-checkbox v-model="newFormInline.required">必填</el-checkbox>
      <el-checkbox v-model="newFormInline.unique">唯一</el-checkbox>
      <el-checkbox v-model="newFormInline.index">索引</el-checkbox>
    </el-form-item>
    <el-form-item label="允许为空">
      <el-checkbox v-model="newFormInline.nullable" />
      <span class="ml-2 text-xs text-gray-400">
        物理列是否允许 NULL（DDL 真源）；默认与「必填」反向，可单独覆盖
      </span>
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

    <el-collapse v-model="advancedOpen" class="mb-4">
      <el-collapse-item title="高级配置" name="advanced">
        <el-form-item
          v-if="showEnum.includes(newFormInline.dataType)"
          label="选择字典"
          prop="dictCode"
        >
          <el-select
            v-model="newFormInline.dictCode"
            class="w-full!"
            placeholder="请选择字典"
            filterable
            clearable
            :loading="dictTypeLoading"
          >
            <el-option
              v-for="item in dictTypes"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select>
        </el-form-item>
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
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="newFormInline.sort"
            :min="0"
            class="w-full!"
          />
        </el-form-item>
        <el-form-item label="展示">
          <el-checkbox v-model="newFormInline.searchable">可搜索</el-checkbox>
          <el-checkbox v-model="newFormInline.listVisible"
            >列表显示</el-checkbox
          >
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>
