<script setup lang="ts">
import { ref } from "vue";
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
      sort: 0,
      options: []
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
  { label: "枚举", value: "ENUM" },
  { label: "JSON", value: "JSON" },
  { label: "文件", value: "FILE" }
];

const showLength = ["STRING", "FILE"];
const showPrecision = ["DECIMAL"];
const showEnum = ["ENUM"];
const showNumber = ["INTEGER", "DECIMAL"];

function getRef() {
  return ruleFormRef.value;
}

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
      label="长度"
      prop="length"
    >
      <el-input-number
        v-model="newFormInline.length"
        :min="1"
        :max="4000"
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
    <el-form-item label="默认值" prop="defaultValue">
      <el-input
        v-model="newFormInline.defaultValue"
        placeholder="请输入默认值"
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
    <el-form-item label="其他">
      <el-checkbox v-model="newFormInline.searchable">可搜索</el-checkbox>
      <el-checkbox v-model="newFormInline.listVisible">列表显示</el-checkbox>
    </el-form-item>
  </el-form>
</template>
