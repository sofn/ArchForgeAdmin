<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import TableForm from "../form/TableForm.vue";
import {
  createMetaTable,
  updateMetaTable,
  getMetaTableDetail
} from "@/api/metaTable";
import { message } from "@/utils/message";
import { cloneDeep } from "lodash-es";
import type { MetaColumn, MetaTable } from "../utils/types";

defineOptions({
  name: "MetaTableDesign"
});

const route = useRoute();
const router = useRouter();
const tableFormRef = ref();
const formInline = ref<MetaTable>({
  tableCode: "",
  tableName: "",
  description: "",
  tablePrefix: "meta_",
  status: 1,
  columns: []
});
const originalColumns = ref<MetaColumn[]>([]);
const isEdit = ref(false);
const id = ref<number | undefined>(undefined);

onMounted(async () => {
  const queryId = route.query.id;
  if (queryId) {
    isEdit.value = true;
    id.value = Number(queryId);
    const { code, data } = await getMetaTableDetail(id.value);
    if (code === 0) {
      formInline.value = {
        ...(data as MetaTable),
        columns: data.columns ?? []
      };
      originalColumns.value = cloneDeep(formInline.value.columns ?? []);
    }
  }
});

async function handleSave() {
  const formRef = tableFormRef.value?.getRef();
  if (!formRef) return;
  formRef.validate(async valid => {
    if (!valid) return;
    const curData = tableFormRef.value.getForm() as MetaTable;
    if (!curData.columns || curData.columns.length === 0) {
      message("请至少配置一个字段", { type: "warning" });
      return;
    }
    try {
      if (isEdit.value && id.value) {
        const dangerous = hasDangerousSchemaChange(
          originalColumns.value,
          curData.columns ?? []
        );
        let force = false;
        if (dangerous) {
          const ok = confirm(
            "检测到字段删除、类型变更、重命名或 NOT NULL 调整，这些操作可能破坏现有数据或依赖，是否继续？"
          );
          if (!ok) return;
          force = true;
        }
        await updateMetaTable(id.value, { ...curData, force });
        message(`已修改元表格"${curData.tableName}"`, { type: "success" });
      } else {
        await createMetaTable(curData);
        message(`已新增元表格"${curData.tableName}"`, { type: "success" });
      }
      closeTabAndBack();
    } catch (e) {
      // request failed, message already shown by http interceptor
    }
  });
}

function handleBack() {
  closeTabAndBack();
}

function closeTabAndBack() {
  const currentPath = route.path;
  useMultiTagsStoreHook().handleTags("splice", currentPath);
  router.push("/meta-table/index");
}

function hasDangerousSchemaChange(
  original: MetaColumn[],
  current: MetaColumn[]
): boolean {
  const currentById = new Map(current.map(c => [c.id, c]));
  for (const oldCol of original) {
    const newCol = currentById.get(oldCol.id);
    if (!newCol) return true;
    if (newCol.columnCode !== oldCol.columnCode) return true;
    if (
      newCol.dataType !== oldCol.dataType ||
      newCol.length !== oldCol.length ||
      newCol.precision !== oldCol.precision ||
      newCol.scale !== oldCol.scale ||
      newCol.required !== oldCol.required
    ) {
      return true;
    }
  }
  return false;
}
</script>

<template>
  <div class="main">
    <el-card shadow="never">
      <template #header>
        <div class="flex-bc">
          <span class="font-medium">{{
            isEdit ? "修改元表格" : "新增元表格"
          }}</span>
          <div class="flex gap-2">
            <el-button @click="handleBack">返回</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </div>
      </template>
      <TableForm ref="tableFormRef" :form-inline="formInline" />
    </el-card>
  </div>
</template>
