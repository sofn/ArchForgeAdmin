<script setup lang="ts">
import { ref, computed, h } from "vue";
import { tableRules } from "../utils/rule";
import type { TableFormProps, MetaColumn } from "../utils/types";
import { cloneDeep } from "lodash-es";
import AddFill from "~icons/ri/add-circle-line";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import FieldForm from "../design/FieldForm.vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { deviceDetection } from "@pureadmin/utils";

const props = defineProps({
  formInline: {
    type: Object as PropType<TableFormProps["formInline"]>,
    default: () => ({
      tableCode: "",
      tableName: "",
      description: "",
      tablePrefix: "meta_",
      status: 1,
      columns: []
    })
  }
});

const ruleFormRef = ref();
const newFormInline = ref<TableFormProps["formInline"]>(props.formInline);

const isEdit = computed(() => !!newFormInline.value.id);

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

function getRef() {
  return ruleFormRef.value;
}

function getForm() {
  return newFormInline.value;
}

function openFieldDialog(field?: MetaColumn, index?: number) {
  const isEditField = field !== undefined;
  addDialog({
    title: `${isEditField ? "编辑" : "新增"}字段`,
    props: {
      formInline: cloneDeep(
        field ?? {
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
          searchType: "LIKE"
        }
      )
    },
    width: "50%",
    draggable: true,
    fullscreen: deviceDetection(),
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(FieldForm, { ref: fieldFormRef, formInline: null }),
    beforeSure: (done, { options }) => {
      const FormRef = fieldFormRef.value.getRef();
      const curData = options.props.formInline as MetaColumn;
      FormRef.validate(valid => {
        if (valid) {
          const columns = newFormInline.value.columns ?? [];
          if (isEditField && index !== undefined) {
            columns[index] = curData;
          } else {
            columns.push(curData);
          }
          newFormInline.value.columns = [...columns];
          message(`字段"${curData.columnName}"已保存`, { type: "success" });
          done();
        }
      });
    }
  });
}

function removeField(index: number) {
  const columns = newFormInline.value.columns ?? [];
  columns.splice(index, 1);
  newFormInline.value.columns = [...columns];
}

function getDataTypeLabel(value: string) {
  return dataTypeOptions.find(o => o.value === value)?.label ?? value;
}

const fieldFormRef = ref();

defineExpose({ getRef, getForm });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="tableRules"
    label-width="100px"
  >
    <el-form-item label="表格编码" prop="tableCode">
      <el-input
        v-model="newFormInline.tableCode"
        :disabled="isEdit"
        placeholder="小写字母、数字、下划线"
      />
    </el-form-item>
    <el-form-item label="表格名称" prop="tableName">
      <el-input
        v-model="newFormInline.tableName"
        placeholder="请输入表格名称"
      />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input
        v-model="newFormInline.description"
        type="textarea"
        :rows="2"
        placeholder="请输入描述"
      />
    </el-form-item>
    <el-form-item label="前缀" prop="tablePrefix">
      <el-input v-model="newFormInline.tablePrefix" placeholder="默认 meta_" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio :value="1">启用</el-radio>
        <el-radio :value="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-divider />

    <div class="flex-bc mb-2">
      <span class="font-bold">字段列表</span>
      <el-button
        type="primary"
        :icon="useRenderIcon(AddFill)"
        @click="openFieldDialog()"
      >
        新增字段
      </el-button>
    </div>

    <el-table :data="newFormInline.columns" border style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="columnCode" label="字段编码" min-width="120" />
      <el-table-column prop="columnName" label="字段名称" min-width="120" />
      <el-table-column label="类型" min-width="100">
        <template #default="{ row }">
          {{ getDataTypeLabel(row.dataType) }}
        </template>
      </el-table-column>
      <el-table-column label="必填" width="80">
        <template #default="{ row }">
          {{ row.required ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="索引" width="120">
        <template #default="{ row }">
          {{
            row.index
              ? row.indexGroup
                ? `联合(${row.indexGroup})`
                : "是"
              : row.unique
                ? "唯一"
                : "否"
          }}
        </template>
      </el-table-column>
      <el-table-column label="搜索方式" width="100">
        <template #default="{ row }">
          {{ row.searchType ?? "-" }}
        </template>
      </el-table-column>
      <el-table-column label="字典编码" width="140">
        <template #default="{ row }">
          {{ row.dataType === "ENUM" ? (row.dictCode ?? "-") : "-" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ $index }">
          <el-button
            link
            type="primary"
            @click="openFieldDialog(newFormInline.columns[$index], $index)"
          >
            编辑
          </el-button>
          <el-button link type="danger" @click="removeField($index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>
